const productCollection = require("../../../model/productSchema")



const product = async(req,res)=>{
    const productData = await productCollection.find()
    res.render('product',{data:productData})
}





module.exports = {product}