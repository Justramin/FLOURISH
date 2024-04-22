
const productCollection = require('../../../model/productSchema')
const categoryCollection = require('../../../model/categorySchema')



const admin_editProduct = async(req,res)=>{
    try {
        if(req.session.isAdminAuth){
            const productId = req.params.id
            const categoryData = await categoryCollection.find()
            const productData = await productCollection.findOne({_id:productId})
            res.render('admin-editProduct',{product:productData,category:categoryData,isSuperAdmin:req.session.isSuperAdmin})
        }else{
            res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.error('Error in admin_editProduct:', error);
        res.status(500).send('Internal Error');
    }
}



const admin_editProductPut = async(req,res)=>{
    try {
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
            
            await productCollection.updateOne({_id:productID},{$set:{
                productName:updateData.productName,
                discription:updateData.discription,
                category:updateData.category,
                price:updateData.price,
                stock:updateData.stock,
                offerPrice:updateData.offerPrice
             }})
             
            await productCollection.updateOne({_id: productID}, {
                $push: { image: { $each: images } }
            });
             res.redirect('/admin/admin-productManage')
        }else{
            res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.error('Error in admin_editProductPut:', error);
        res.status(500).send('Internal Error');
    }
    
}



const productImageDelete = async(req,res)=>{
    try {
        if(req.session.isAdminAuth){
            const productID = req.params.id
            const imagePath = req.query.index
            const imageDElete = await productCollection.updateOne({_id:productID},{$pull:{image:imagePath}})
            res.redirect(`/admin/admin_editProduct/${productID}`);
        }else{
            res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.error('Error in productImageDelete:', error);
        res.status(500).send('Internal Error');
    } 
}





module.exports ={
    admin_editProduct,
    admin_editProductPut,
    productImageDelete
}