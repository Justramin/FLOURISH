const couponCollection = require("../../../model/CouponSchema")
const mongoose = require('mongoose');
const { alphanumValid, onlyNumbers, isValidCoupon, isFutureDate } = require('../../../utils/validator');  // Ensure this line is correct







const adminEditcoupen = async(req,res)=>{
    try {
       

            const coupenID = req.params.id
            const coupenData = await couponCollection.findOne({_id:coupenID})
            res.render('admin-editCoupons',{coupen:coupenData,isSuperAdmin:req.session.isSuperAdmin})
       
    } catch (error) {
        console.error('Error in adminEditcoupen:', error);
        res.redirect('/admin/errorPage')
    } 
}




const adminEditCouponsPost = async (req, res) => {
    try {
      
            const { couponCode, description, minimumPrice, discount, maxRedeem, expiry } = req.body;
            const couponID = req.params.id;

            // Validate inputs
            const couponValid = isValidCoupon(couponCode);
            const minimumPriceValid = onlyNumbers(minimumPrice);
            const discountValid = onlyNumbers(discount) && discount >= 0 && discount <= 100;
            const maxRedeemValid = onlyNumbers(maxRedeem) && maxRedeem > 0;
            const expiryValid = isFutureDate(expiry);

            if (!couponValid) {
                req.flash('couponCodeError', 'Invalid. Use 6 uppercase letters/digits.');
                return res.redirect(`/admin/admin_editCoupens/${couponID}`);
            } else if (!minimumPriceValid) {
                req.flash('minimumPriceError', 'Enter a valid minimum price');
                return res.redirect(`/admin/admin_editCoupens/${couponID}`);
            } else if (!discountValid) {
                req.flash('discountError', 'Enter a valid discount (0-100)');
                return res.redirect(`/admin/admin_editCoupens/${couponID}`);
            } else if (!maxRedeemValid) {
                req.flash('maxRedeemError', 'Enter a valid max redeem count');
                return res.redirect(`/admin/admin_editCoupens/${couponID}`);
            } else if (!expiryValid) {
                req.flash('expiryError', 'Enter a future expiry date');
                return res.redirect(`/admin/admin_editCoupens/${couponID}`);
            }

            const couponExists = await couponCollection.findOne({ couponCode });

            if (couponExists && couponExists._id.toString() !== couponID) {
                req.flash('couponCodeError', 'Coupon code already exists');
                return res.redirect(`/admin/admin_editCoupens/${couponID}`);
            }

            await couponCollection.updateOne(
                { _id:couponID},
                {
                    $set: {
                        couponCode,
                        description,
                        minimumPrice,
                        discount,
                        maxRedeem,
                        expiry
                    }
                }
            );

            res.redirect('/admin/admin_coupensManage');
       
    } catch (error) {
        console.error('Error in adminEditCouponsPost:', error);
        res.redirect('/admin/errorPage');
    }
};







module.exports = {
    adminEditcoupen,
    adminEditCouponsPost,
}