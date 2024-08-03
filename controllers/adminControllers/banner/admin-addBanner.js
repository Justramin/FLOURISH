

const bannerCollection = require("../../../model/bannerSchema");


const admin_addBanner = async (req,res)=>{
    try {
        
            res.render('admin-addBanner',{isSuperAdmin:req.session.isSuperAdmin})
       
    } catch (error) {
        console.error('Error in admin_addBanner:', error);
        res.redirect('/admin/errorPage')
    }   
}




const admin_addBannerPost = async (req,res)=>{
    try {
        const banner = new bannerCollection({
            bannerName: req.body.bannerName,
            description: req.body.description,
            image: req.file ? '/uploads/' + req.file.filename : undefined,
        });
       
        const newBannerData = await banner.save();
        console.log(newBannerData);
        
        res.redirect("/admin/admin_banner")
       
    } catch (error) {
        console.error('Error in admin_addBannerPost:', error);
        res.redirect('/admin/errorPage')
    }   
}




module.exports = {
    admin_addBanner,
    admin_addBannerPost
}