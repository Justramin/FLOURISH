const productCollection = require("../../../model/productSchema");

const home = async (req, res) => {
    try {
       
        const products = await productCollection.find({}).populate('category').sort({ _id: -1 });  
        const filteredProducts = products.filter(product => product.status === true && product.category.status === true); 
        const limitedProducts = filteredProducts.slice(0, 4);

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
