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
        res.status(500).send('Internal Error');
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