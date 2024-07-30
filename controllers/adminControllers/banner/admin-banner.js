const bannerCollection = require("../../../model/bannerSchema");



const admin_banner = async (req,res)=>{
    try {
       const bannerData = await bannerCollection.find()
        res.render('admin-banner',{
            isSuperAdmin:req.session.isSuperAdmin,
            banner:bannerData
        })
    
    } catch (error) {
        console.error('Error in admin_banner:', error);
        res.redirect('/admin/errorPage')
    }
}



module.exports = {
    admin_banner
}