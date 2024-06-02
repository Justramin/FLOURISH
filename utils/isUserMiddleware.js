const collection = require("../model/userSchema");




const isUser = async (req, res, next) => {
    try {
        if (!req.session.isUser) {
            return res.redirect('/login');
        }


        const user =await collection.findOne({_id:req.session.isUser._id})
        if (user && user.status) {
            next();
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        console.log("user controller isUser error: " + err);
        res.redirect('/userError')
    }
};

module.exports = {
    isUser
};