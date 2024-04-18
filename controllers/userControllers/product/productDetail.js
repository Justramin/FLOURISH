const productCollection = require("../../../model/productSchema")
const categoryCollection = require('../../../model/categorySchema')



const productDetail = async(req,res)=>{
    const productID = req.query.id
    const productData =await productCollection.findOne({_id:productID}).populate('category')    
    res.render('productDetail',{data:productData})
}

module.exports = {productDetail}