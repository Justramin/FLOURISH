const collection = require("../../../model/userSchema");
const {validatePassword } = require('../../../utils/validation');




const resetPassword = async(req,res)=>{
    try {
        
        res.render('resetPassword',{isUser:req.session.isUser})
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.redirect('/userError');
    }  
}





const resetPasswordPost = async(req,res)=>{
    try {
        const { pass, Npass, Cpass } = req.body
        const user =await collection.findOne({_id:req.session.isUser._id})

        if (!validatePassword(Npass)) {
            req.flash('error', 'Make a strong Paasword');
            return res.redirect('/resetPassword');
          }


        if(Npass !== Cpass){
            req.flash('error', 'New password and confirm password do not match');
            return res.redirect('/resetPassword');
        }else{
            user.password = Npass;
            await user.save();
            res.redirect('/profilePage')
        }




        res.render('resetPassword',{isUser:req.session.isUser})
    } catch (error) {
        console.error('Error in resetPasswordPost:', error);
        res.redirect('/userError')
    }  
}







module.exports = {
    resetPassword,
    resetPasswordPost
}
