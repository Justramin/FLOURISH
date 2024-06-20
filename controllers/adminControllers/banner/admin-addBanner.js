


const admin_addBanner = async (req,res)=>{
    try {
        
            res.render('admin-addBanner',{isSuperAdmin:req.session.isSuperAdmin})
       
    } catch (error) {
        console.error('Error in admin_addBanner:', error);
        res.redirect('/admin/errorPage')
    }   
}


module.exports = {
    admin_addBanner
}