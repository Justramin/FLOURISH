const adminCollection = require("../../../model/adminSchema")





const admin_addAdmin = async (req,res)=>{
    try {
       
            res.render('admin-addAdmin')  
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