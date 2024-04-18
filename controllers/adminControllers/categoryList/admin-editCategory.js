const categoryCollection = require('../../../model/categorySchema')




const admin_editCategory = async(req,res)=>{
   
    if(req.session.isAdminAuth){
        const categoryID = req.params.id
        const categoryData = await categoryCollection.findOne({_id:categoryID})
        res.render('admin-editCategory',{category:categoryData})
    }else{
            res.redirect('/admin/admin-login')
        }

}


const admin_editCategoryPost = async(req,res)=>{
    if(req.session.isAdminAuth){
        const categoryData = req.body
        const categoryID = req.params.id

        const dataUpload = await categoryCollection.updateOne({_id:categoryID},{$set:{
            categoryName:categoryData.categoryName,
            discount:categoryData.discount,
            description:categoryData.description
        }})
        res.redirect('/admin/admin_categoryList')
    }else{
        res.redirect('/admin/admin-login')
    }
}






    
    module.exports = {
        admin_editCategory,
        admin_editCategoryPost
    }