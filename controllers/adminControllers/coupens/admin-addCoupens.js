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
        if (req.session.isAdminAuth) {

            
            const { couponCode, minimumPrice, discount, expiry, maxRedeem, discription,} = req.body;

            const couponAlready = await couponCollection.findOne({couponCode:couponCode})
           

            // Validate inputs
            const couponValid = isValidCoupon(couponCode);
            const minimumPriceValid = onlyNumbers(minimumPrice);
            const discountValid = onlyNumbers(discount) && discount >= 0 && discount <= 100;
            const maxRedeemValid = onlyNumbers(maxRedeem) && maxRedeem > 0;
            const expiryValid = isFutureDate(expiry);


            if(couponAlready){
                req.flash('couponCodeError', 'Invalid. This Coupons Already Created');
                return res.redirect('/admin/admin_addCoupens');
            }

            else if (!couponValid) {
                console.log('--------------enteriing.....2')
                req.flash('couponCodeError', 'Invalid. Use 6 uppercase letters/digits.');
                return res.redirect('/admin/admin_addCoupens');
            }
            else if (!minimumPriceValid) {
                console.log('--------------enteriing.....3')
                req.flash('minimumPriceError', 'Enter a valid minimum price');
                return res.redirect('/admin/admin_addCoupens');
            }
            else if (!discountValid) {
                console.log('--------------enteriing.....4')
                req.flash('discountError', 'Enter a valid discount (0-100)');
                return res.redirect('/admin/admin_addCoupens');
            }
            else if (!maxRedeemValid) {
                console.log('--------------enteriing.....5')
                req.flash('maxRedeemError', 'Enter a valid max redeem count');
                return res.redirect('/admin/admin_addCoupens');
            }
            else if (!expiryValid) {
                console.log('--------------enteriing.....6')
                req.flash('expiryError', 'Enter a future expiry date');
                return res.redirect('/admin/admin_addCoupens');
            }

            const couponExists = await couponCollection.findOne({ couponCode });
            if (couponExists) {
                console.log('--------------enteriing.....7')
                req.flash('couponCodeError', 'Coupon already exists');
                return res.redirect('/admin/admin_addCoupens');
            }
            console.log('--------------enteriing.....8')
            const couponData = await couponCollection.create({
                couponCode,
                discription: discription,
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
