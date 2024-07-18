const offerCollection = require("../../../model/offersSchema");
const { alphanumValid, onlyNumbers, isValidCoupon, isFutureDate } = require('../../../utils/validator');



const admin_addOffers = async (req, res) => {
    try {
       
           res.render('admin-addOffers',{
            isSuperAdmin: req.session.isSuperAdmin,
           })
       
    } catch (error) {
        console.error('Error in admin_coupensManage:', error);
        res.redirect('/admin/errorPage');
    }
};




const adminAddOfferPost = async (req, res) => {
    try {
        const { offerName, discription, discount, starting, expiry } = req.body;

        
        const discountValid = onlyNumbers(discount) && discount >= 0 && discount <= 100;
        const startingValid = isFutureDate(starting);
        const expiryValid = isFutureDate(expiry);

        if (!discountValid) {
            req.flash('discountError', 'Enter a valid discount (0-100)');
            return res.redirect('/admin/admin_addOffers');
        } else if (!startingValid) {
            req.flash('startingError', 'Enter a valid  date');
            return res.redirect('/admin/admin_addOffers');
        } else if (!expiryValid) {
            req.flash('expiryError', 'Enter a future expiry date');
            return res.redirect('/admin/admin_addOffers');
        }

        const newOffer = new offerCollection({
            offerName,
            discription,
            discount: Number(discount),
            startingDate: new Date(starting),
            endingDate: new Date(expiry),
        });

        await newOffer.save();

        res.redirect('/admin/admin_offers');
    } catch (error) {
        console.error('Error in admin_coupensManage:', error);
        res.redirect('/admin/errorPage');
    }
};






module.exports = {
    admin_addOffers,
    adminAddOfferPost
}