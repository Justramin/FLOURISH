const admincollection = require("../../../model/adminSchema")
const { ObjectId } = require('mongodb')



const admin_adminManage = async (req,res)=>{
const superadmin =await admincollection.findOne({email:req.session.adminEmail})
    if(req.session.isAdminAuth && superadmin.superAdmin){
        const adminData =await admincollection.find({superAdmin:false})
        res.render('admin-adminManage',{admin:adminData})
    }else{
        res.redirect('/admin/admin-login')
    }
}




const admin_adminStatus = async(req,res)=>{
    const adminId = req.params.id
    const adminStatus = req.query.status

    if(req.session.isAdminAuth){
        let adminData;
        if(adminStatus=="true"){
            adminData = await admincollection.updateOne({_id:new ObjectId(adminId)},{$set:{status:false}})
        }else{
            adminData = await admincollection.updateOne({_id:new ObjectId(adminId)},{$set:{status:true}})
        }
        res.redirect('/admin/admin_adminMnage')
    }else{
        res.redirect('/admin/admin-login')
    }
    
}


module.exports = {
    admin_adminManage,
    admin_adminStatus
}