const categoryCollection = require('../../../model/categorySchema')
const productCollection = require('../../../model/productSchema')




const admin_addProduct = async(req,res)=>{
    if(req.session.isAdminAuth){
        const categoryData = await categoryCollection.find()
        res.render('admin-addProduct',{category:categoryData})
    }else{
        res.redirect('/admin/admin-login')
    }
}





const admin_addProductPost = async(req,res)=>{
    if(req.session.isAdminAuth){

        //Images
        const files = req.files;
    const images = [];
    files.forEach((file) => {
      const image = file.filename;
      images.push(image);
    });
    
       const productData= req.body
       console.log(productData,'////////////--------------------//////////');
        const addproduct = await productCollection.create([productData])
       const imageUpload = await productCollection.updateOne({productName:productData.productName},{$set:{image:images}})
        res.redirect('/admin/admin-productManage')
       
        
    }else{
        res.redirect('/admin/admin-login')
    }
}




module.exports = {
    admin_addProduct,
    admin_addProductPost
}