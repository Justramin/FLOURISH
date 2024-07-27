const collection = require("../../../model/userSchema")
const walletCollection = require("../../../model/walletSchema")
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



// function to generate unique refferal code
const generateuniqueRefferalCode = async () => {
    let code;
    let isUnique = false;
    while (!isUnique) {
        const length = Math.floor(Math.random() * 3) + 6; // Random length between 6 and 8
        code = Math.random().toString(36).substring(2, 2 + length).toUpperCase();
        const existingUser = await collection.findOne({ refferralCode: code });
        if (!existingUser) {
            isUnique = true;
        }
    }
    return code;
};




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
                const RefrlUser = await collection.findOne({refferralCode:userData.refferralCode})

                if(RefrlUser){
                    const walletTransactionsuser = {
                        remarks: 'Refferal Reward',
                        date:new Date(),
                        type:'Credit',
                        amount:100,
                    }
                    await walletCollection.updateOne({userId:RefrlUser._id},{$inc:{wallet: 100},$addToSet:{walletTransactions:walletTransactionsuser}},{upsert:true})

                }
                userData.refferralCode = await generateuniqueRefferalCode()
                const value = await collection.create([userData]);
                req.session.userDetails=null
                req.session.isUser=value[0];

                if(RefrlUser){
                    const walletTransactionrefferal = {
                        remarks: 'Refferal Reward',
                        date:new Date(),
                        type:'Credit',
                        amount:100,
                    }
                    await walletCollection.updateOne({userId:req.session.isUser._id},{$inc:{wallet: 100},$addToSet:{walletTransactions:walletTransactionrefferal}},{upsert:true})
                }

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
