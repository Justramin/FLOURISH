const couponCollection = require("../../../model/CouponSchema");



const admin_coupensManage = async (req, res) => {
    try {
       
            const perPage = 10;
            const page = parseInt(req.query.page) || 1; 

            
            const coupons = await couponCollection.find({})
                .sort({ _id: -1 })
                .skip((perPage * page) - perPage)
                .limit(perPage);

            
            const count = await couponCollection.countDocuments();

            res.render('admin-coupensManage', {
                isSuperAdmin: req.session.isSuperAdmin,
                coupons: coupons,
                currentPage: page,
                totalPages: Math.ceil(count / perPage)
            });
       
    } catch (error) {
        console.error('Error in admin_coupensManage:', error);
        res.redirect('/admin/errorPage');
    }
};








module.exports = {
    admin_coupensManage
}