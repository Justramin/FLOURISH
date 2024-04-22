const categoryCollection = require("../../../model/categorySchema")
const { ObjectId } = require('mongodb');




const admin_categoryList = async(req,res)=>{
    try {
        if(req.session.isAdminAuth){
            const category = await categoryCollection.find()
            res.render('admin-categoryList',{category:category,isSuperAdmin:req.session.isSuperAdmin})
        }else{
            res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.error('Error in admin_categoryList:', error);
        res.redirect('/admin/errorPage')
    } 
}





const admin_categoryStatus = async(req,res)=>{
    try {
        const categoryId = req.params.id
        const categoryStatus = req.query.status
        if(req.session.isAdminAuth){
            let category;
        if(categoryStatus=="true"){
            category = await categoryCollection.updateOne({_id:new ObjectId(categoryId)},{$set:{status:false}})
        }else{
            category = await categoryCollection.updateOne({_id:new ObjectId(categoryId)},{$set:{status:true}})
        }
        res.redirect('/admin/admin_categoryList')
    }else{
        res.redirect('/admin/admin-login')
    }
    } catch (error) {
        console.error('Error in admin_categoryStatus:', error);
        res.redirect('/admin/errorPage')
    }
}





module.exports = {
    admin_categoryList,
    admin_categoryStatus
}