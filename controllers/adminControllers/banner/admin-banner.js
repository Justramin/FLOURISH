


const admin_banner = async (req,res)=>{
    try {
        if(req.session.isAdminAuth){
            res.render('admin-banner',{isSuperAdmin:req.session.isSuperAdmin})
        }else{
            res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.error('Error in admin_banner:', error);
        res.status(500).send('Internal Error');
    }
}



module.exports = {
    admin_banner
}