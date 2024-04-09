const adminCollection = require("../../../model/adminSchema")





const admin_addAdmin = async (req,res)=>{
    if(req.session.isAdminAuth){
        res.render('admin-addAdmin')
    }else{
        res.redirect('/admin/admin-login')
    }
}


const newAdmin = async (req,res)=>{
    try{
        const adminData =req.body
        await adminCollection.create([adminData])
        res.redirect('/admin/admin_adminMnage')
    }catch(error){
        console.log('error in the newAdmin ',error)
    }
}


module.exports = {
    admin_addAdmin,
    newAdmin
}