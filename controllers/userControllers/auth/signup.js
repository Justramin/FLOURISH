const collection = require("../../../model/userSchema")
const otpGeneratorUser = require("../../../utils/otp-generator")
const sendMail = require("../../../utils/otp-nodeMailer")
const { validateName, validateEmail, validatePassword, validatePhoneNumber } = require('../../../utils/validation');





const user_signup = async(req,res)=>{
    res.render('signup')
}

const user_signupPost= async(req,res)=>{
    const { name, email, phone, password } = req.body;

     // Simple validation
  if (!validateName(name)) {
    req.flash('error', 'Enter a valid username');
    return res.redirect('/signup');
  }
  
  else if ( !validateEmail(email)) {
    req.flash('error', 'Enter valid email');
    return res.redirect('/signup'); 
  }

  else if ( !validatePhoneNumber(phone)) {
    req.flash('error', 'Enter a valid Phone Number');
    return res.redirect('/signup');
  }

  else if ( !validatePassword(password)) {
    req.flash('error', 'Make strong  password');
    return res.redirect('/signup');
  }


  const alreadyloginUserData =await collection.findOne({email:email});

  if (alreadyloginUserData) {
    req.flash('error', 'Email already exist.')
    return res.redirect('/signup') 
  }


  // Store user data and OTP in session
    req.session.userData = { name, email, phone, password }
    const otp = await otpGeneratorUser()
    req.session.newUserOtp = otp
 
    console.log(`Main OTP ${otp}`);
    sendMail(email,name,otp)
    res.redirect('/signupOtp')
}
module.exports ={user_signup,user_signupPost}