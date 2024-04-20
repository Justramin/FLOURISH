const productCollection = require("../../../model/productSchema")



const product = async(req,res)=>{
    try {
        const productData = await productCollection.find()

        res.render('product',{data:productData,isUser:req.session.isUser})
    } catch (error) {
        console.error('Error in product:', error);
        res.status(500).send('Internal Error');
    } 
}





module.exports = {
    product
}