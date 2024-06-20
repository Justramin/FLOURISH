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
        res.redirect('/admin/errorPage')
    }  
}



const admin_login_post = async (req, res) => {
    try {
        const adminData = req.body;
        const findData = await adminCollection.findOne({ email: adminData.email });

        if (!findData) {
            req.flash('error', '*Please enter correct email and password');
            return res.redirect('/admin');
        }

        if (findData.password !== adminData.password) {
            req.flash('error', '*Incorrect password');
            return res.redirect('/admin');
        }

        if (!findData.status) {
            req.flash('error', '*Access denied. Try again later');
            return res.redirect('/admin');
        }

        if (findData.superAdmin) {
            req.session.isSuperAdmin = true;
        }

        req.session.isAdminAuth = true;
        req.session.adminEmail = adminData.email;
        return res.redirect('/admin/admin_dashbord');
    } catch (error) {
        console.error('Error in admin_login_post:', error);
        res.redirect('/admin/errorPage');
    }
};



const admin_logout = async(req,res)=>{
    try {
        req.session.isAdminAuth = false
        req.session.isSuperAdmin= false
        res.redirect('/admin/admin-login')
    } catch (error) {
        console.error('Error in admin_logout:', error);
        res.redirect('/admin/errorPage')
    }  
}




module.exports = {
    admin_login,
    admin_login_post,
     admin_logout
    }