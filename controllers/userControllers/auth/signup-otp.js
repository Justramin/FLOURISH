const collection = require("../../../model/userSchema")
const otpGeneratorUser = require("../../../utils/otp-generator")
const sendMail = require("../../../utils/otp-nodeMailer")



const signupOtpGet = async(req,res)=>{
    try {
        const {email} = req.session.userData
        res.render('signupOtp',{email:email})
    } catch (error) {
        console.error('Error in signupOtpGet:', error);
        res.status(500).send('Internal Error');
    } 
}




const signupOtp = async(req,res)=>{
    try {
        const otp = req.body.otp    
        const oldOtp = req.session.newUserOtp
        const otpTimestamp = req.session.userData.otpTimestamp

        console.log(`body OTP ${otp}`);
        console.log(`session 1st OTP ${oldOtp}`)



    if(otp === oldOtp && (new Date().getTime() - otpTimestamp) <= 20000) {
        const userData = req.session.userData;
        const value = await collection.create([userData])
        console.log(value)
        res.redirect('/home')
    }else{
        req.flash('error', 'Invalid OTP or OTP has expired.')
        res.redirect('/signupOtp')
    }
    } catch (error) {
        console.error('Error in signupOtp:', error);
        res.status(500).send('Internal Error');
    } 
}




const resendOtp = async (req,res)=>{
    try {
        const {name,email} =  req.session.userData
        const otpTimestamp = req.session.userData.otpTimestamp || 0;
        console.log(name,email);
        console.log(new Date().getTime());
        console.log(otpTimestamp);
    if ((new Date().getTime() - otpTimestamp) >= 20000) {
        const newOtp = await otpGeneratorUser();  
        req.session.newUserOtp = newOtp;
        req.session.userData.otpTimestamp=new Date().getTime()
        console.log(`session 2nd OTP ${newOtp}`);
        sendMail(email,name,newOtp)
     
    }
        res.redirect('/signupOtp')
    } catch (error) {
        console.error('Error in resendOtp:', error);
        res.status(500).send('Internal Error');
    }
}






module.exports = {
    signupOtp,
    signupOtpGet,
    resendOtp
}
