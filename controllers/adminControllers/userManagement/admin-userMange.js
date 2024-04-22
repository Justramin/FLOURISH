const collection = require("../../../model/userSchema")
const { ObjectId } = require('mongodb')


const admin_userManage = async(req,res)=>{
    try {
        if(req.session.isAdminAuth){
            const userData = await collection.find()
            res.render('admin-userManage',{users:userData,isSuperAdmin:req.session.isSuperAdmin})
        }else{
            res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.error('Error in admin_userManage:', error);
        res.redirect('/admin/errorPage')
    }
}




const admin_userStatus = async(req,res)=>{
    try {
        const userId = req.params.id
        const userStatus = req.query.status
    if(req.session.isAdminAuth){
        let userData;
        if(userStatus=="true"){
             userData = await collection.updateOne({_id:new ObjectId(userId)},{$set:{status:false}})
        }else{
             userData = await collection.updateOne({_id:new ObjectId(userId)},{$set:{status:true}})
        }
        res.redirect('/admin/admin-userManage')
    }else{
        res.redirect('/admin/admin-login')
    }
    } catch (error) {
        console.error('Error in admin_userStatus:', error);
        res.redirect('/admin/errorPage')
    }  
}




module.exports = {
    admin_userManage,
    admin_userStatus
}