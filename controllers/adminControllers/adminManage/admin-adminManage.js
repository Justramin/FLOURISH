const admincollection = require("../../../model/adminSchema")
const { ObjectId } = require('mongodb')



const admin_adminManage = async (req,res)=>{
    try {
        const superadmin =await admincollection.findOne({email:req.session.adminEmail})
        if(!req.session.isAdminAuth){
            res.redirect('/admin/admin-login')
        }

        if(req.session.isAdminAuth && superadmin.superAdmin){
            const adminData =await admincollection.find({superAdmin:false})
            res.render('admin-adminManage',{admin:adminData})
        }else{
            res.render('admin-adminNot')
        }
    } catch (error) {
        console.error('Error in admin_adminManage:', error);
        res.status(500).send('Internal Error');
    }
}




const admin_adminStatus = async(req,res)=>{
    try {
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
    } catch (error) {
        console.error('Error in admin_adminStatus:', error);
        res.status(500).send('Internal Error');
    }  
}


module.exports = {
    admin_adminManage,
    admin_adminStatus
}