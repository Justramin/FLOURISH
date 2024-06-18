const userCollection = require("../../../model/userSchema");
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });




const userProfile = async(req,res)=>{
    try {
        
        res.render('userProfile',{isUser:req.session.isUser})
    } catch (error) {
        console.error('Error in userProfile:', error);
        res.redirect('/userError')
    }  
}

const userProfilePost = async(req,res)=>{
    try {


        const userId = req.session.isUser._id;

        let user = await userCollection.findById(userId);
        user.name = req.body.username;
        user.email = req.body.email;
        user.phone = req.body.phone;

        if (req.file) {
            user.image = '/uploads/' + req.file.filename;
            await user.save();
        }
        const newUserData = await user.save();
      
        req.session.isUser = newUserData
        res.redirect('/profilePage')
    } catch (error) {
        console.error('Error in profileeditePost:', error);
        res.redirect('/userError');
    }  
}


module.exports = {
    userProfile,
    userProfilePost
}