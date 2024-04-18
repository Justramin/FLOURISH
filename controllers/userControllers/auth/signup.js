const collection = require("../../../model/userSchema")
const otpGeneratorUser = require("../../../utils/otp-generator")
const sendMail = require("../../../utils/otp-nodeMailer")
const { validateName, validateEmail, validatePassword, validatePhoneNumber } = require('../../../utils/validation');





const user_signup = async(req,res)=>{
  try {
    res.render('signup')
  } catch (error) {
    console.error('Error in user_signup:', error);
        res.status(500).send('Internal Error');
  } 
}




const user_signupPost= async(req,res)=>{
  try {
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
      req.flash('error', 'Paasword Use 1 Capital, 1 small @ Special cherachter at leest 6 digit');
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
        res.status(500).send('Internal Error');
  } 
}





module.exports ={
  user_signup,
  user_signupPost
}




