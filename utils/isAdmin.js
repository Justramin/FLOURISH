const Admincollection = require("../model/adminSchema");




const isAdmin = async (req, res, next) => {
    try {
        if (!req.session.isAdminAuth) {
            return res.redirect('/admin');
        }


        const admin =await Admincollection.findOne({_id:req.session.isAdminAuth._id})
        if (admin && admin.status) {
            res.locals.adminData = admin
            next();
        } else {
            res.redirect('/admin');
        }
    } catch (err) {
        console.log("Admin controller isAdmin error: " + err);
        res.redirect('/errorPage')
    }
};

module.exports = {
    isAdmin
};