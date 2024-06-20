


const admin_banner = async (req,res)=>{
    try {
       
        res.render('admin-banner',{isSuperAdmin:req.session.isSuperAdmin})
    
    } catch (error) {
        console.error('Error in admin_banner:', error);
        res.redirect('/admin/errorPage')
    }
}



module.exports = {
    admin_banner
}