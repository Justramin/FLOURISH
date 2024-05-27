const couponCollection = require("../../../model/CouponSchema");



const admin_coupensManage = async(req,res)=>{
    try {
        const coupons = await couponCollection.find()
        console.log(coupons);
        if(req.session.isAdminAuth){
            res.render('admin-coupensManage',{isSuperAdmin:req.session.isSuperAdmin,coupons:coupons})
        }else{
            res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.error('Error in admin_coupensManage:', error);
        res.redirect('/admin/errorPage')
    }
}







module.exports = {
    admin_coupensManage
}