const offerCollection = require("../../../model/offersSchema");




const admin_offers = async (req, res) => {
    try {
        
           const offerData = await offerCollection.find()
    res.render('admin-offers',{
        isSuperAdmin: req.session.isSuperAdmin,
        offers:offerData
    })
    } catch (error) {
        console.error('Error in admin_offers:', error);
        res.redirect('/admin/errorPage');
    }
};




module.exports = {
    admin_offers
}