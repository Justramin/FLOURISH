const addressCollection = require("../../../model/adressSchema");





const address = async(req,res)=>{
    try {
        const isUser=req.session.isUser
        const userAddress = await addressCollection.findOne({userID:isUser._id})
        if (userAddress && userAddress.address.length > 0) {
            userAddress.address.reverse(); // Reverse the address array
        }
        res.render('address',{isUser:isUser,userAddress:userAddress})
    } catch (error) {
        console.error('Error in address:', error);
        res.redirect('/userError')
    }  
}




module.exports = {
    address
}


