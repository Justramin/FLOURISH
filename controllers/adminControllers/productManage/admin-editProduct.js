
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
        res.redirect('/admin/errorPage')
    }
}



const admin_editProductPut = async(req,res)=>{
    try {
        if(req.session.isAdminAuth){
            const productID = req.params.id
            const productData = req.body
            const productReg = req.body.productName
            const productRegex = new RegExp(`^${productReg}$`,'i')
            const productName = await productCollection.find({productName:{$regex:productRegex}})

             //Images
             const files = req.files;
             const images = [];
             files.forEach((file) => {
               const image = file.filename;
               images.push(image);
             });



            if(productName.length ===0  ||  productID == productName[0]._id){
                await productCollection.updateOne({_id:productID},{$set:{
                    productName:productData.productName,
                    discription:productData.discription,
                    category:productData.category,
                    price:productData.price,
                    stock:productData.stock,
                    offerPrice:productData.offerPrice
                 }})
                 
                await productCollection.updateOne({_id: productID}, {
                    $push: { image: { $each: images } }
                });
                 res.redirect('/admin/admin-productManage')
            }else{
                req.flash('error', 'product Name already Exist');
                res.redirect(`/admin/admin_editProduct/${productID}`)
            }
            
        }else{
            res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.error('Error in admin_editProductPut:', error);
        res.redirect('/admin/errorPage')
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
        res.redirect('/admin/errorPage')
    } 
}





module.exports ={
    admin_editProduct,
    admin_editProductPut,
    productImageDelete
}