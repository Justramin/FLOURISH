const categoryCollection = require("../../../model/categorySchema");
const offerCollection = require("../../../model/offersSchema");



const admin_addCategory = async (req,res)=>{
    try {
       const offerData = await offerCollection.find()
        res.render('admin-addCategory',{
            offers:offerData,
            isSuperAdmin:req.session.isSuperAdmin})
    } catch (error) {
        console.error('Error in admin_addCategory:', error);
        res.redirect('/admin/errorPage')
    }  
}



const admin_addCategoryPost = async (req,res)=>{
    try {
        const { categoryName, offers, description } = req.body;
            const categoryRegex = new RegExp(`^${categoryName}$`,'i')
            const existingCategory = await categoryCollection.findOne({categoryName:{$regex:categoryRegex}})
           
            let newCategory
            if(!existingCategory){
                 newCategory = {
                    categoryName,
                    offers: offers || null,
                    description
                };
    
                await categoryCollection.create(newCategory)
                res.redirect('/admin/admin_categoryList')    
            }else{
                req.flash('error', 'Category Name already Exist');
                res.redirect('/admin/admin_addCategory')
            }
            
    } catch (error) {
        console.error('Error in admin_addCategoryPost:', error);
        res.redirect('/admin/errorPage')
    }  
}






module.exports = {
    admin_addCategory,
    admin_addCategoryPost
}


