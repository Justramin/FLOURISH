

const offerCollection = require('../../../model/offersSchema');
const { ObjectId } = require('mongodb');
const { alphanumValid, onlyNumbers, isValidCoupon, isFutureDate } = require('../../../utils/validator');


const admin_editOffer = async(req,res)=>{
    try {
            const offerID = req.params.id
            const offerData = await offerCollection.findOne({_id:offerID})
            res.render('admin-editOffes',{
                offer:offerData,
                isSuperAdmin:req.session.isSuperAdmin
            })
       
    } catch (error) {
        console.error('Error in admin_editOffer:', error);
        res.redirect('/admin/errorPage')
    } 
}









const adminOfferStatus = async(req,res)=>{
    try {
        const offerId = req.params.id
        const offerStatus = req.query.status
        
            let offer;
        if(offerStatus=="true"){
            offer = await offerCollection.updateOne({_id:new ObjectId(offerId)},{$set:{status:false}})
        }else{
            offer = await offerCollection.updateOne({_id:new ObjectId(offerId)},{$set:{status:true}})
        }
        res.redirect('/admin/admin_offers')
   
    } catch (error) {
        console.error('Error in adminOfferStatus:', error);
        res.redirect('/admin/errorPage')
    }
}






const adminEditofferPost = async (req, res) => {
    try {
        const { offerName, description, discount, starting, expiry } = req.body;
        const offerID = req.params.id;

        const updatedOffer = await offerCollection.findByIdAndUpdate(
            offerID,
            {
                offerName,
                description,
                discount,
                startingDate: new Date(starting),
                endingDate: new Date(expiry)
            },
            { new: true } 
        );

        res.redirect('/admin/admin_offers');
          
       
    } catch (error) {
        console.error('Error in adminEditofferPost:', error);
        res.redirect('/admin/errorPage');
    }
};








module.exports = {
    adminOfferStatus,
    admin_editOffer,
    adminEditofferPost
}