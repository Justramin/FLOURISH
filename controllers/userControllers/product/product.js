const productCollection = require("../../../model/productSchema")



const product = async(req,res)=>{
    try {
        const productData = await productCollection.find()

        res.render('product',{data:productData,isUser:req.session.isUser})
    } catch (error) {
        console.error('Error in product:', error);
        res.redirect('/userError')
    } 
}





module.exports = {
    product
}