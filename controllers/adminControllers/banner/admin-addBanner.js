


const admin_addBanner = async (req,res)=>{
    if(req.session.isAdminAuth){
        res.render('admin-addBanner')
    }else{
        res.redirect('/admin/admin-login')
    }
}
module.exports = {admin_addBanner}