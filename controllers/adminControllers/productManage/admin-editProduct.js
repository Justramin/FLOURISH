
const productCollection = require('../../../model/productSchema')
const categoryCollection = require('../../../model/categorySchema')



const admin_editProduct = async(req,res)=>{
    if(req.session.isAdminAuth){
        const productId = req.params.id
        const categoryData = await categoryCollection.find()
        const productData = await productCollection.findOne({_id:productId})
        res.render('admin-editProduct',{product:productData,category:categoryData})
    }else{
        res.redirect('/admin/admin-login')
    }

}



const admin_editProductPut = async(req,res)=>{
    if(req.session.isAdminAuth){
        const productID = req.params.id
        const updateData = req.body


         //Images
         const files = req.files;
         const images = [];
         files.forEach((file) => {
           const image = file.filename;
           images.push(image);
         });
        
         const dataUpload = await productCollection.updateOne({_id:productID},{$set:{
            productName:updateData.productName,
            discription:updateData.discription,
            category:updateData.category,
            price:updateData.price,
            stock:updateData.stock,
            offerPrice:updateData.offerPrice
         }})
         
         const imageUpload = await productCollection.updateOne({_id: productID}, {
            $push: { image: { $each: images } }
        });
         res.redirect('/admin/admin-productManage')
    }else{
        res.redirect('/admin/admin-login')
    }
}



const productImageDelete = async(req,res)=>{
    if(req.session.isAdminAuth){
        const productID = req.params.id
        const imagePath = req.query.index
        const imageDElete = await productCollection.updateOne({_id:productID},{$pull:{image:imagePath}})
        res.redirect(`/admin/admin_editProduct/${productID}`);
    }else{
        res.redirect('/admin/admin-login')
    }
}





module.exports ={
    admin_editProduct,
    admin_editProductPut,
    productImageDelete
}