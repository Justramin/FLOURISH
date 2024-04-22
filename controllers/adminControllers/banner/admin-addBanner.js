


const admin_addBanner = async (req,res)=>{
    try {
        if(req.session.isAdminAuth){
            res.render('admin-addBanner',{isSuperAdmin:req.session.isSuperAdmin})
        }else{
            res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.error('Error in admin_addBanner:', error);
        res.redirect('/admin/errorPage')
    }   
}


module.exports = {
    admin_addBanner
}