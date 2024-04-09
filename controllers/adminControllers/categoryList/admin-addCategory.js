const categoryCollection = require("../../../model/categorySchema")



const admin_addCategory = async (req,res)=>{
    if(req.session.isAdminAuth){
        res.render('admin-addCategory')
    }else{
        res.redirect('/admin/admin-login')
    }
}



const admin_addCategoryPost = async (req,res)=>{
    if(req.session.isAdminAuth){
        const category = req.body
        console.log(category);
        const Data = await categoryCollection.find({categoryName:category.categoryName})
        console.log(Data);
        if(!Data){
            const categoryData = await categoryCollection.create([category])
        }
        
        res.redirect('/admin/admin_categoryList')
    }else{
        res.redirect('/admin/admin-login')
    }
}
module.exports = {
    admin_addCategory,
    admin_addCategoryPost
}


