const productCollection = require("../../../model/productSchema")
const categoryCollection = require('../../../model/categorySchema')



const productDetail = async(req,res)=>{
    try {
        const fewProducts = await productCollection.find().sort({_id: -1}).limit(4);
        const productID = req.query.id
        const productData =await productCollection.findOne({_id:productID}).populate('category')    
        res.render('productDetail',{data:productData,isUser:req.session.isUser,fewPro:fewProducts})
    } catch (error) {
        console.error('Error in productDetail:', error);
        res.redirect('/userError')
    }    
}





module.exports = {
    productDetail
}