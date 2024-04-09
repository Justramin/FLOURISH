


const admin_banner = async (req,res)=>{
    if(req.session.isAdminAuth){
        res.render('admin-banner')
    }else{
        res.redirect('/admin/admin-login')
    }
}
module.exports = {admin_banner}