const collection = require("../../../model/userSchema")
const otpGeneratorUser = require("../../../utils/otp-generator")
const sendMail = require("../../../utils/otp-nodeMailer")
const { validateName, validateEmail, validatePassword, validatePhoneNumber } = require('../../../utils/validation');





const user_signup = async(req,res)=>{
  try {
    if (!req.session.isUser) {
      const userDetails = req.session.userDetails
      res.render('signup',{details:userDetails})
      }else{
          res.redirect('/')
      }
    
  } catch (error) {
    console.error('Error in user_signup:', error);
    res.redirect('/userError')
  } 
}




const user_signupPost= async(req,res)=>{
  try {
    req.session.userDetails = req.body
    const { name, email, phone, password } = req.body;

    // Simple validation
    if (!validateName(name)) {
      req.flash('nameError', 'Enter a valid username');
      return res.redirect('/signup');
    }
 
    else if ( !validateEmail(email)) {
      req.flash('emailError', 'Enter valid email');
      return res.redirect('/signup'); 
    }

    else if ( !validatePhoneNumber(phone)) {
      req.flash('numberError', 'Enter a valid Phone Number');
      return res.redirect('/signup');
    }

    else if ( !validatePassword(password)) {
      req.flash('passwordError', 'Make a strong Paasword');
      return res.redirect('/signup');
    }


    const alreadyloginUserData =await collection.findOne({email:email});

    if (alreadyloginUserData) {
      req.flash('error', 'Email already exist.')
      return res.redirect('/signup') 
    }


    // Generate OTP and store it in session Only One minuts
    const otp = await otpGeneratorUser()
    const otpTimestamp = new Date().getTime();         // Current time
    req.session.userData = { name, email, phone, password , otpTimestamp }
    req.session.newUserOtp = otp

    console.log(`Main OTP ${otp}`);
    sendMail(email,name,otp)
    res.redirect('/signupOtp')
  } catch (error) {
    console.error('Error in user_signupPost:', error);
    res.redirect('/userError')
  } 
}





module.exports ={
  user_signup,
  user_signupPost
}




