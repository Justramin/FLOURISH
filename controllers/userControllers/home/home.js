const productCollection = require("../../../model/productSchema");
const whishlistCollection = require("../../../model/whishlistSchema");

const home = async (req, res) => {
    try {
       
        const products = await productCollection.find({}).populate('category').sort({ _id: -1 });  
        const filteredProducts = products.filter(product => product.status === true && product.category.status === true); 
        const limitedProducts = filteredProducts.slice(0, 4);

        
        if (req.session.isUser) {
            const wishlist = await whishlistCollection.findOne({ userId: req.session.isUser._id });
            const wishlistProductIds = wishlist ? wishlist.items.map(item => item.proId.toString()) : [];

            limitedProducts.forEach(product => {
                product.inWishlist = wishlistProductIds.includes(product._id.toString());

           
            });
        } else {
            limitedProducts.forEach(product => {
                product.inWishlist = false;
            });
        }

        // const activeProducts = products.filter(product => product.category.status === true);

        res.render('home', {
            isUser: req.session.isUser,
            productData: limitedProducts,
        });
    } catch (error) {
        console.error('Error in home:', error);
        res.redirect('/userError');
    }
};

module.exports = {
    home
};
