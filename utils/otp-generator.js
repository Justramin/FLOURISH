const otpGenerator = require('otp-generator')



async function otpGeneratorUser (){
    return otpGenerator.generate(5,{upperCaseAlphabets:false,specialChars:false,lowerCaseAlphabets:false})
}

module.exports = otpGeneratorUser 