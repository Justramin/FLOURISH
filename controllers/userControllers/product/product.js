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
            .populate({
                path: 'category',
                populate: { path: 'offers' } 
            })
            .populate('offers')



            //INSERT OFFER PRICE

            for (let i = 0; i < products.length; i++) {
                let product = products[i];
        

                
                // Initialize variables to store maximum offer details
                let maxOfferPercentage = 0;
        
                // Check if there is a product-specific offer
                if (product.offers && product.offers.discount) {
                    maxOfferPercentage = product.offers.discount;
                }
        
                // Check if there is a category-wide offer
                if (product.category && product.category.offers && product.category.offers.discount) {
                    let categoryOfferPercentage = product.category.offers.discount;
                    if (categoryOfferPercentage > maxOfferPercentage) {
                        maxOfferPercentage = categoryOfferPercentage;
                        maxOfferDiscount = categoryOfferPercentage; // Assuming you want to use the percentage directly
                    }
                }
        
                // Calculate offer price based on the maximum discount percentage found
                if (maxOfferPercentage > 0) {
                    let originalPrice = product.price;
                    let offerPrice = originalPrice * (1 - maxOfferPercentage / 100);
                    offerPrice = Math.round(offerPrice * 100) / 100; // Round to 2 decimal places
        
                    // Update the product document with the calculated offer price
                    product.offerPrice = offerPrice;
        
                    // Save the updated product document
                    await product.save();
                }
            }
            











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