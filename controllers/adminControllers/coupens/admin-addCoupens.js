const couponCollection = require('../../../model/CouponSchema');
const { ObjectId } = require('mongodb');
const { alphanumValid, onlyNumbers, isValidCoupon, isFutureDate } = require('../../../utils/validator');  // Ensure this line is correct

const admin_addCoupens = async (req, res) => {
    try {
       
            res.render('admin-addCoupens', { isSuperAdmin: req.session.isSuperAdmin });
       
    } catch (error) {
        console.error('Error in admin_addCoupens:', error);
        res.redirect('/admin/errorPage');
    }
};

const adminAddCouponsPost = async (req, res) => {
    try {
            
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
               
                req.flash('couponCodeError', 'Invalid. Use 6 uppercase letters/digits.');
                return res.redirect('/admin/admin_addCoupens');
            }
            else if (!minimumPriceValid) {
              
                req.flash('minimumPriceError', 'Enter a valid minimum price');
                return res.redirect('/admin/admin_addCoupens');
            }
            else if (!discountValid) {
             
                req.flash('discountError', 'Enter a valid discount (0-100)');
                return res.redirect('/admin/admin_addCoupens');
            }
            else if (!maxRedeemValid) {
            
                req.flash('maxRedeemError', 'Enter a valid max redeem count');
                return res.redirect('/admin/admin_addCoupens');
            }
            else if (!expiryValid) {
             
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
                discription: discription,
                minimumPrice,
                discount,
                maxRedeem,
                expiry
            });
          
            res.redirect('/admin/admin_coupensManage');
       
    } catch (error) {
        console.error('Error in adminAddCouponsPost:', error);
        res.redirect('/admin/errorPage');
    }
};


const adminCouponStatus = async(req,res)=>{
    try {
        const coupensId = req.params.id
        const coupensStatus = req.query.status
        
            let coupens;
        if(coupensStatus=="true"){
            coupens = await couponCollection.updateOne({_id:new ObjectId(coupensId)},{$set:{status:false}})
        }else{
            coupens = await couponCollection.updateOne({_id:new ObjectId(coupensId)},{$set:{status:true}})
        }
        res.redirect('/admin/admin_coupensManage')
   
    } catch (error) {
        console.error('Error in adminCouponStatus:', error);
        res.redirect('/admin/errorPage')
    }
}


module.exports = {
    admin_addCoupens,
    adminAddCouponsPost,
    adminCouponStatus
}
