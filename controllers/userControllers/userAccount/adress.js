const addressCollection = require("../../../model/adressSchema");





const address = async(req,res)=>{
    try {
        const isUser=req.session.isUser
        const userAddress = await addressCollection.findOne({userID:isUser._id})
        // const Address =userAddress.address[0]
        res.render('address',{isUser:isUser,userAddress:userAddress})
    } catch (error) {
        console.error('Error in address:', error);
        res.redirect('/userError')
    }  
}




module.exports = {
    address
}


