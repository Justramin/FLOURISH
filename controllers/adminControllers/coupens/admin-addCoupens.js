const couponCollection = require('../../../model/CouponSchema');
const { alphanumValid, onlyNumbers, isValidCoupon, isFutureDate } = require('../../../utils/validator');  // Ensure this line is correct

const admin_addCoupens = async (req, res) => {
    try {
        if (req.session.isAdminAuth) {
            res.render('admin-addCoupens', { isSuperAdmin: req.session.isSuperAdmin });
        } else {
            res.redirect('/admin/admin-login');
        }
    } catch (error) {
        console.error('Error in admin_addCoupens:', error);
        res.redirect('/admin/errorPage');
    }
};

const adminAddCouponsPost = async (req, res) => {
    try {
        console.log('--------------enteriing.....');
        if (req.session.isAdminAuth) {
            const { couponCode, minimumPrice, discount, expiry, maxRedeem, couponType } = req.body;

            // Validate inputs
            const couponValid = isValidCoupon(couponCode);
            const minimumPriceValid = onlyNumbers(minimumPrice);
            const discountValid = onlyNumbers(discount) && discount >= 0 && discount <= 100;
            const maxRedeemValid = onlyNumbers(maxRedeem) && maxRedeem > 0;
            const expiryValid = isFutureDate(expiry);

            if (!couponValid) {
                req.flash('couponCodeError', 'Enter a valid coupon code');
                return res.redirect('/admin/admin_addCoupens');
            }
            if (!minimumPriceValid) {
                req.flash('minimumPriceError', 'Enter a valid minimum price');
                return res.redirect('/admin/admin_addCoupens');
            }
            if (!discountValid) {
                req.flash('discountError', 'Enter a valid discount (0-100)');
                return res.redirect('/admin/admin_addCoupens');
            }
            if (!maxRedeemValid) {
                req.flash('maxRedeemError', 'Enter a valid max redeem count');
                return res.redirect('/admin/admin_addCoupens');
            }
            if (!expiryValid) {
                req.flash('expiryError', 'Enter a future expiry date');
                return res.redirect('/admin/admin_addCoupens');
            }

            const couponExists = await couponCollection.findOne({ couponCode });
            if (couponExists) {
                req.flash('couponCodeError', 'Coupon already exists');
                return res.redirect('/admin/admin_addCoupens');
            }

            const couponData = await couponCollection.create({
                couponCode,
                type: couponType,
                minimumPrice,
                discount,
                maxRedeem,
                expiry
            });
            console.log("Coupon created:", couponData);
            res.redirect('/admin/admin_coupensManage');
        } else {
            res.redirect('/admin/admin-login');
        }
    } catch (error) {
        console.error('Error in adminAddCouponsPost:', error);
        res.redirect('/admin/errorPage');
    }
};

module.exports = {
    admin_addCoupens,
    adminAddCouponsPost
}
