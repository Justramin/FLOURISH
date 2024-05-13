const collection = require("../model/userSchema");




const isUser = async (req, res, next) => {
    try {
        const user =await collection.findOne({_id:req.session.isUser._id})
        console.log(user);
        if (req.session.isUser && user.status) {
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