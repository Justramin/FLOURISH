const adminCollection = require("../../../model/adminSchema")


const admin_login = async(req,res)=>{
    try {
        if(req.session.isAdminAuth){
            res.redirect('/admin/admin_dashbord')
        }else{
            res.render('admin-login')
        }
    } catch (error) {
        console.error('Error in admin_login:', error);
        res.status(500).send('Internal Error');
    }  
}



const admin_login_post = async(req,res)=>{
    try {
        const adminData= req.body
        const findData =await adminCollection.findOne({email:adminData.email})
        if(!findData || findData.password !== adminData.password || !findData.status){
            console.log("wrong somthing");
            req.flash('error', '*You are Blocked by Super Admin')
            res.redirect('/admin')
        }else {
            if(findData.superAdmin){
                req.session.isSuperAdmin=true
            }
            req.session.isAdminAuth = true
            req.session.adminEmail = req.body.email
            return res.redirect('/admin/admin_dashbord')
        }
    } catch (error) {
        console.error('Error in admin_login_post:', error);
        res.status(500).send('Internal Error');
    }  
}


const admin_logout = async(req,res)=>{
    try {
        req.session.isAdminAuth = false
        req.session.isSuperAdmin= false
        res.redirect('/admin/admin-login')
    } catch (error) {
        console.error('Error in admin_logout:', error);
        res.status(500).send('Internal Error');
    }  
}




module.exports = {
    admin_login,
    admin_login_post,
     admin_logout
    }