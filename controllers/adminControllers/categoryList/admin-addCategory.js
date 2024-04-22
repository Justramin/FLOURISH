const categoryCollection = require("../../../model/categorySchema")



const admin_addCategory = async (req,res)=>{
    try {
        if(req.session.isAdminAuth){
            res.render('admin-addCategory',{isSuperAdmin:req.session.isSuperAdmin})
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
            const category = req.body.categoryName
            const newCategory = req.body;
            const categoryRegex = new RegExp(`^${category}$`,'i')
            const categoryName = await categoryCollection.find({categoryName:{$regex:categoryRegex}})
            
            if(categoryName.length===0){
                await categoryCollection.create([newCategory])
                res.redirect('/admin/admin_categoryList')    
            }else{
                req.flash('error', 'Category Name already Exist');
                res.redirect('/admin/admin_addCategory')
            }
            
        }else{y
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


