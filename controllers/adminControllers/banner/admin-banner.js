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


const admin_deleteBanner = async (req,res)=>{
    try {
        
        const bannerId = req.params.id;
        await bannerCollection.findByIdAndDelete(bannerId);
        res.redirect('/admin/admin_banner');
    } catch (error) {
        console.error('Error in admin_deleteBanner:', error);
        res.redirect('/admin/errorPage')
    }
}


module.exports = {
    admin_banner,
    admin_deleteBanner
}