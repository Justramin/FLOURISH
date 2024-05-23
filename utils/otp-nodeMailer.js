const nodemailer = require("nodemailer");

const sendMail = async (email,name,otp) => {
  try {
    let testAccount = await nodemailer.createTestAccount();

    // connect with the smtp
    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure:true,
      auth: {
        user: "justramin000@gmail.com",
        pass: "slbc tvdv upse gayc",
      },
    });


    let info = await transporter.sendMail({
      from: '"Justin " <justramin000@gmail.com>', // sender address
      to: email, // list of receivers
      subject: `Hellow ${name}`, // Subject line
      text: `Your OTP is: ${otp}`, // plain text body
      html: `<b>Your OTP is: ${otp}</b>`, // html body
    }); 
  } catch (error) {
    console.log('node mail error ',error)
    res.redirect('/userError')
  }
  
};

module.exports = sendMail;