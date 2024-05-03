const productCollection = require("../../../model/productSchema")
const categoryCollection = require('../../../model/categorySchema')



const productDetail = async(req,res)=>{
    try {
        const productID = req.query.id
        const productData =await productCollection.findOne({_id:productID}).populate('category')    
        res.render('productDetail',{data:productData,isUser:req.session.isUser})
    } catch (error) {
        console.error('Error in productDetail:', error);
        res.status(500).send('Internal Error');
    }    
}





module.exports = {
    productDetail
}