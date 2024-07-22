const collection = require("../../../model/userSchema")
const otpGeneratorUser = require("../../../utils/otp-generator")
const sendMail = require("../../../utils/otp-nodeMailer")



const signupOtpGet = async(req,res)=>{
    try {
        if (!req.session.isUser) {
            res.render('signupOtp')
            }else{
                res.redirect('/')
            }
       
    } catch (error) {
        console.error('Error in signupOtpGet:', error);
        res.redirect('/userError')
    } 
}


const signupWithOtp = async (req, res) => {
    try {
        const otp = req.body.otp;
        
        const oldOtp = req.session.newUserOtp;
        const otpTimestamp = req.session.userData.otpTimestamp;

        console.log(`body OTP ${otp}`);
        console.log(`session 1st OTP ${oldOtp}`);

        const currentTime = new Date().getTime();
        const timeDifference = currentTime - otpTimestamp;
        
        if (otp === oldOtp) {
            if (timeDifference <= 30000) {
                const userData = req.session.userData;
                const value = await collection.create([userData]);
                req.session.userDetails=null
                req.session.isUser=value[0];
                res.redirect('/');
            } else {
                console.log("error OTP has expired");
                req.flash('error', 'OTP has expired.');
                res.redirect('/signupOtp');
            }
        } else {
            console.log("error invalid OTP");
            req.flash('error', 'Invalid OTP.');
            res.redirect('/signupOtp');
        }
        
    } catch (error) {
        console.error('Error in signupWithOtp:', error);
        res.redirect('/userError')
    }
};




const resendOtp = async (req,res)=>{
    try {
        const {name,email} =  req.session.userData
        const otpTimestamp = req.session.userData.otpTimestamp || 0;
        
    if ((new Date().getTime() - otpTimestamp) >= 30000) {
        const newOtp = await otpGeneratorUser();  
        req.session.newUserOtp = newOtp;
        req.session.userData.otpTimestamp=new Date().getTime()
        console.log(`session 2nd OTP ${newOtp}`);
        sendMail(email,name,newOtp)
     
    }
        res.redirect('/signupOtp')
    } catch (error) {
        console.error('Error in resendOtp:', error);
        res.redirect('/userError')
    }
}






module.exports = {
    signupOtpGet,
    resendOtp,
    signupWithOtp
}
