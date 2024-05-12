const productCollection = require("../../../model/productSchema")
const categoryCollection = require('../../../model/categorySchema')


const product = async(req,res)=>{
    try {
        const category = req.query.category;
        const categoryData = await categoryCollection.findOne({categoryName:category})
        let productData;
        if(category){
            productData = await productCollection.find({category:categoryData._id})
        }else{
            productData = await productCollection.find()
        }

        res.render('product',{data:productData,isUser:req.session.isUser})
    } catch (error) {
        console.error('Error in product:', error);
        res.redirect('/userError')
    } 
}





module.exports = {
    product
}