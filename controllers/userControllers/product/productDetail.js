const productCollection = require("../../../model/productSchema")
const categoryCollection = require('../../../model/categorySchema');
const whishlistCollection = require("../../../model/whishlistSchema");



const productDetail = async(req,res)=>{
    try {
      
        const products = await productCollection.find({}).populate('category').sort({ _id: -1 });  
        const filteredProducts = products.filter(product => product.status === true && product.category.status === true);
        const limitedProducts = filteredProducts.slice(0, 4);

        
        
            const productID = req.query.id 
   
            const productData =await productCollection.findOne({_id:productID}).populate('category') 

        if (req.session.isUser) {
            const wishlist = await whishlistCollection.findOne({ userId: req.session.isUser._id });
            const wishlistProductIds = wishlist ? wishlist.items.map(item => item.proId.toString()) : [];

            
            productData.inWishlist = wishlistProductIds.includes(productData._id.toString());
        } else {
        
            productData.inWishlist = false;
        }
        console.log(productData);
        res.render('productDetail',{data:productData,isUser:req.session.isUser,fewPro:limitedProducts})
    } catch (error) {
        console.error('Error in productDetail:', error);
        res.redirect('/userError')
    }    
}





module.exports = {
    productDetail
}