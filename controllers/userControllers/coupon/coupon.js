


// const moment = require("moment");

const couponCollection = require("../../../model/CouponSchema");
const collection = require("../../../model/userSchema");




const applyCoupon = async (req, res) => {
    try {    
       const {couponCode,subtotal}= req.body
       req.session.couponCode = couponCode
       const coupon = await couponCollection.findOne({couponCode:couponCode})
       const userId = req.session.isUser._id

       if(coupon && coupon.status === true){
        const user = await collection.findOne({_id:userId})
     
        if(user && user.usedCoupons.includes(couponCode)){
            res.json({ success: false, message: "Already Redeemed" });


        }else if(coupon.expiry > new Date() && coupon.minimumPrice <= subtotal){

            let dicprice = (subtotal * coupon.discount) /100
            if (dicprice >= coupon.maxRedeem) {
                dicprice = coupon.maxRedeem;
              }
              price = subtotal - dicprice;
              req.session.finalPrice = price


                res.json({ success: true, dicprice, price });
        }else{
            res.json({ success: false, message: "Invalid Coupon" });
        }
       }else{
        res.json({ success: false, message: "Coupon not found" });
       }
    } catch (error) {
        console.error('Error in applyCoupon:', error);
        res.redirect('/userError');
    }
}



module.exports ={
    applyCoupon,
}