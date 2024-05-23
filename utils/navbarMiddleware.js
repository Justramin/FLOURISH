const cartCollection = require("../model/cartSchema");
const whishlistCollection = require("../model/whishlistSchema");


const whishlistcart = async(req,res,next)=>{
    try {

        const userId = req.session.isUser;
       
        if (!userId) {
            return next();
        }

        let whishlistData = await whishlistCollection.findOne({userId:userId._id}).populate('items')
        let cartData = await cartCollection.findOne({userId:userId._id}).populate('items.productId')
        if (!cartData) {
            cartData = { items: [], Cart_total: 0 };
        }
        if(!whishlistData){
            whishlistData = { items:[]};
        }
       
        res.locals.whishlistData = whishlistData
        res.locals.cartData = cartData
        next();

    } catch (error) {
        console.error('Error in whishlistcart:', error);
        res.redirect('/userError')
    }  
}


module.exports = {
    whishlistcart
}