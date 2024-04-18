const categoryCollection = require("../../../model/categorySchema")



const admin_addCategory = async (req,res)=>{
    try {
        if(req.session.isAdminAuth){
            res.render('admin-addCategory')
        }else{
            res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.error('Error in admin_addCategory:', error);
        res.status(500).send('Internal Error');
    }  
}



const admin_addCategoryPost = async (req,res)=>{
    try {
        if(req.session.isAdminAuth){
            const category = req.body
            const categoryName = await categoryCollection.find({categoryName:category.categoryName})
            if(!categoryName){
                const categoryData = await categoryCollection.create([category])
            }
            res.redirect('/admin/admin_categoryList')
        }else{
            res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.error('Error in admin_addCategoryPost:', error);
        res.status(500).send('Internal Error');
    }  
}






module.exports = {
    admin_addCategory,
    admin_addCategoryPost
}


