const adminCollection = require("../../../model/adminSchema")





const admin_addAdmin = async (req,res)=>{
    try {
        if(req.session.isAdminAuth){
            res.render('admin-addAdmin')
        }else{
            res.redirect('/admin/admin-login')
        }  
    } catch (error) {
        console.error('Error in admin_addAdmin:', error);
        res.redirect('/admin/errorPage')
    }
}


const newAdmin = async (req,res)=>{
    try{
        const adminData =req.body
        await adminCollection.create([adminData])
        res.redirect('/admin/admin_adminMnage')
    }catch(error){
        console.error('error in the newAdmin ',error)
        res.redirect('/admin/errorPage')
    }
}


module.exports = {
    admin_addAdmin,
    newAdmin
}