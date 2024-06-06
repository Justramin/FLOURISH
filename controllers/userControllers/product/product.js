const productCollection = require("../../../model/productSchema");
const categoryCollection = require('../../../model/categorySchema');

const product = async (req, res) => {
    try {
        const limit = 8; 
        let page = Number(req.query.page) || 1;

        const { category, sort, filter, stock, search } = req.query;
        let sortOption = {};
        let filtering = { status: true };

        // Set sort options
        if (sort === 'newness') {
            sortOption = { _id: -1 };
        } else if (sort === 'priceLow') {
            sortOption = { offerPrice: 1 };
        } else if (sort === 'priceHigh') {
            sortOption = { offerPrice: -1 };
        }

        // Set filter options
        if (filter === '0to1k') {
            filtering.offerPrice = { $gte: 0, $lte: 1000 };
        } else if (filter === '1kto5k') {
            filtering.offerPrice = { $gte: 1000, $lte: 5000 };
        } else if (filter === '5kto25k') {
            filtering.offerPrice = { $gte: 5000, $lte: 25000 };
        } else if (filter === '25kto1lak') {
            filtering.offerPrice = { $gte: 25000, $lte: 100000 };
        } else if (filter === '1lakPlus') {
            filtering.offerPrice = { $gte: 100000 };
        }

        // Stock filter options
        if (stock === 'inStock') {
            filtering.stock = { $gt: 0 };
        } else if (stock === 'outOffStock') {
            filtering.stock = { $lt: 1 };
        }

        const categoryData = category ? await categoryCollection.findOne({ categoryName: category }) : null;
        const catData = await categoryCollection.find().sort({ _id: -1 }).limit(5);

        let products;
        if (search) {
            products = await productCollection.find({ productName: { $regex: search, $options: 'i' } }).sort(sortOption).populate('category');
        } else if (category) {
            products = await productCollection.find({ category: categoryData._id }).sort(sortOption).populate('category');
        } else {
            products = await productCollection.find(filtering).sort(sortOption).populate('category');
        }

        // Filter products by active category status
        const activeProducts = products.filter(product => product.category.status === true);

        // Pagination logic
        const TOTAL_COUNT_OF_PRODUCTS = activeProducts.length;
        const totalPages = Math.ceil(TOTAL_COUNT_OF_PRODUCTS / limit);
        page = Math.max(1, Math.min(page, totalPages));
        const skip = (page - 1) * limit;

        // Get the products for the current page
        const paginatedProducts = activeProducts.slice(skip, skip + limit);

        res.render('product', {
            data: paginatedProducts,
            isUser: req.session.isUser,
            catData: catData,
            page: page,
            totalPages: totalPages,
        });
    } catch (error) {
        console.error('Error in product:', error);
        res.redirect('/userError');
    }
};

module.exports = {
    product,
};
