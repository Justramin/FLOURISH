const categoryCollection = require('../../../model/categorySchema')




const admin_editCategory = async(req,res)=>{
    try {
        
            const categoryID = req.params.id
            const categoryData = await categoryCollection.findOne({_id:categoryID})
            res.render('admin-editCategory',{category:categoryData,isSuperAdmin:req.session.isSuperAdmin})
        
    } catch (error) {
        console.error('Error in admin_editCategory:', error);
        res.redirect('/admin/errorPage')
    } 
}




const admin_editCategoryPost = async(req,res)=>{
    try {
       
            const categoryData = req.body
            const categoryID = req.params.id
            const categoryReg = req.body.categoryName
            const categoryRegex = new RegExp(`^${categoryReg}$`,'i')
            const categoryName = await categoryCollection.find({categoryName:{$regex:categoryRegex}})

            if(categoryName.length ===0  ||  categoryID == categoryName[0]._id){
                await categoryCollection.updateOne({_id:categoryID},{$set:{
                    categoryName:categoryData.categoryName,
                    discount:categoryData.discount,
                    description:categoryData.description
                }})
                res.redirect('/admin/admin_categoryList')
            }else{
                req.flash('error', 'Category Name already Exist');
                res.redirect(`/admin/admin_editCategory/${categoryID}`)
            }         
       
    } catch (error) {
        console.error('Error in admin_editCategoryPost:', error);
        res.redirect('/admin/errorPage')
    }
}



    
module.exports = {
    admin_editCategory,
    admin_editCategoryPost
}