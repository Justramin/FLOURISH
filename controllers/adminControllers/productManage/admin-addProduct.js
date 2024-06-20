const categoryCollection = require('../../../model/categorySchema')
const productCollection = require('../../../model/productSchema')




const admin_addProduct = async(req,res)=>{
    try {
       
            const categoryData = await categoryCollection.find()
            res.render('admin-addProduct',{category:categoryData,isSuperAdmin:req.session.isSuperAdmin})
       
    } catch (error) {
        console.error('Error in admin_addProduct:', error);
        res.redirect('/admin/errorPage')
    }
    
}





const admin_addProductPost = async(req,res)=>{
    try {
       
            //Images
            const files = req.files;
            const images = [];
            files.forEach((file) => {
                const image = file.filename;
                images.push(image);
        });
        
        const productData= req.body
        const newProduct = req.body.productName
        const ProductRegex = new RegExp(`^${newProduct}$`,'i')
        const ProductName = await productCollection.find({productName:{$regex:ProductRegex}})

        if(ProductName.length===0){
            await productCollection.create([productData])
            await productCollection.updateOne({productName:productData.productName},{$set:{image:images}})
            res.redirect('/admin/admin-productManage')
        }else{
            req.flash('error', 'ProductName Name already Exist');
            res.redirect('/admin/admin_addProduct')
        }


       
       
    } catch (error) {
        console.error('Error in admin_addProductPost:', error);
        res.redirect('/admin/errorPage')
    }  
};





module.exports = {
    admin_addProduct,
    admin_addProductPost
}