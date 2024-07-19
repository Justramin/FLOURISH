const categoryCollection = require('../../../model/categorySchema')
const offerCollection = require('../../../model/offersSchema')




const admin_editCategory = async(req,res)=>{
    try {
            const offersData = await offerCollection.find()
            const categoryID = req.params.id
            const categoryData = await categoryCollection.findOne({_id:categoryID}).populate('offers');
            res.render('admin-editCategory',{
                category:categoryData,
                offers:offersData,
                isSuperAdmin:req.session.isSuperAdmin})
        
    } catch (error) {
        console.error('Error in admin_editCategory:', error);
        res.redirect('/admin/errorPage')
    } 
}




const admin_editCategoryPost = async(req,res)=>{
    try {
       console.log(req.body);
            const { categoryName, offers, description } = req.body;
            const categoryID = req.params.id
            const categoryRegex = new RegExp(`^${categoryName}$`,'i')
            const existingCategory = await categoryCollection.find({categoryName:{$regex:categoryRegex}})

            if(existingCategory.length ===0  ||  categoryID == existingCategory[0]._id){
                await categoryCollection.updateOne({_id:categoryID},{$set:{
                    categoryName:categoryName,
                    offers:offers || null,
                    description:description
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