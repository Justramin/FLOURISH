const collection = require("../../../model/userSchema")
const { ObjectId } = require('mongodb')


const admin_userManage = async(req,res)=>{
    if(req.session.isAdminAuth){
        const userData = await collection.find()
        // console.log(userData);
        res.render('admin-userManage',{users:userData})
    }else{
        res.redirect('/admin/admin-login')
    }
    
}



const admin_userStatus = async(req,res)=>{
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
    
}


module.exports = {
    admin_userManage,
    admin_userStatus
}