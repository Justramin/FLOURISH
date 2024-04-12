
const productCollection = require('../../../model/productSchema')
const categoryCollection = require('../../../model/categorySchema')






const admin_editProduct = async(req,res)=>{

    const productId = req.params.id
    
    if(req.session.isAdminAuth){
        const categoryData = await categoryCollection.find()
        const productData = await productCollection.findOne({_id:productId})
        console.log(productData,);
        res.render('admin-editProduct',{product:productData,category:categoryData})
    }else{
        res.redirect('/admin/admin-login')
    }
}


module.exports ={
    admin_editProduct
}