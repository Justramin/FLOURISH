const productCollection = require("../../../model/productSchema");
const categoryCollection = require('../../../model/categorySchema');
const whishlistCollection = require("../../../model/whishlistSchema");

const product = async (req, res) => {
    try {


        const limit = 8; 
        let page = Number(req.query.page) || 1;

        const { category, sort, filter, stock, search } = req.query;

        let sortOption = {};
        let filtering = { status: true };


        // Set sort options
        switch (sort) {
            case 'newness':
                sortOption = { _id: -1 };
                break;
            case 'priceLow':
                sortOption = { offerPrice: 1 };
                break;
            case 'priceHigh':
                sortOption = { offerPrice: -1 };
                break;
        }


       // Set filter options
       switch (filter) {
        case '0to1k':
            filtering.offerPrice = { $gte: 0, $lte: 1000 };
            break;
        case '1kto5k':
            filtering.offerPrice = { $gte: 1000, $lte: 5000 };
            break;
        case '5kto25k':
            filtering.offerPrice = { $gte: 5000, $lte: 25000 };
            break;
        case '25kto1lak':
            filtering.offerPrice = { $gte: 25000, $lte: 100000 };
            break;
        case '1lakPlus':
            filtering.offerPrice = { $gte: 100000 };
            break;
    }


        // Stock filter options
        if (stock === 'inStock') {
            filtering.stock = { $gt: 0 };
        } else if (stock === 'outOffStock') {
            filtering.stock = { $lt: 1 };
        }


        const categoryData = category ? await categoryCollection.findOne({ categoryName: category }) : null;
        const catData = await categoryCollection.find().sort({ _id: -1 }).limit(5);

        if (category && categoryData) {
            filtering.category = categoryData._id;
        }

        if (search) {
            filtering.productName = { $regex: search, $options: 'i' };
        }


        // Fetch filtered and sorted products without pagination
        const products = await productCollection.find(filtering)
            .sort(sortOption)
            .populate('category');

        // Filter products by active category status
        const activeProducts = products.filter(product => product.category.status === true);



         // Fetch filtered and sorted products with pagination
         const totalProducts = activeProducts.length ;
         const totalPages = Math.ceil(totalProducts / limit);
         page = Math.max(1, Math.min(page, totalPages));
         const skip = (page - 1) * limit;
         const paginatedProducts = activeProducts.slice(skip, skip + limit);


       


         if (req.session.isUser) {
            const wishlist = await whishlistCollection.findOne({ userId: req.session.isUser._id });
            const wishlistProductIds = wishlist ? wishlist.items.map(item => item.proId.toString()) : [];

            activeProducts.forEach(product => {
                product.inWishlist = wishlistProductIds.includes(product._id.toString());

           
            });
        } else {
            activeProducts.forEach(product => {
                product.inWishlist = false;
            });
        }




      



     



   
  

        res.render('product', {
            data: paginatedProducts,
            isUser: req.session.isUser,
            catData: catData,
            page: page,
            totalPages: totalPages,
            category: category || '',
            sort: sort || '',
            filter: filter || '',
            stock: stock || '',
            search: search || ''
        });
    } catch (error) {
        console.error('Error in product:', error);
        res.redirect('/userError');
    }
};

module.exports = {
    product,
};