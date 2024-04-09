const nodemailer = require("nodemailer");

const sendMail = async (email,name,otp) => {
  let testAccount = await nodemailer.createTestAccount();

  // connect with the smtp
  let transporter = await nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure:true,
    auth: {
      user: "justramin000@gmail.com",
      pass: "mipj aiby fcfc lwwd",
    },
  });


  let info = await transporter.sendMail({
    from: '"Justin " <thapa@gmail.com>', // sender address
    to: email, // list of receivers
    subject: `Hellow ${name}`, // Subject line
    text: `Your OTP is: ${otp}`, // plain text body
    html: `<b>Your OTP is: ${otp}</b>`, // html body
  }); 
};

module.exports = sendMail;