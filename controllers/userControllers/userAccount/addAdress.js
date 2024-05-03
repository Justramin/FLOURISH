const addressCollection = require("../../../model/adressSchema");




const addAddress = async(req,res)=>{
    try {
        
        console.log(req.session.isUser);
        res.render('addAddress',{isUser:req.session.isUser})
    } catch (error) {
        console.error('Error in addAddress:', error);
        res.status(500).send('Internal Error');
    }  
}




const addAddresspost = async(req,res)=>{
    try {
        const addressData = req.body
        addressData.userID =req.session.isUser._id
        console.log(addressData);
        const addAddress =await addressCollection.create(addressData)
    } catch (error) {
        console.error('Error in addAddresspost:', error);
        res.status(500).send('Internal Error');
    }  
}


module.exports = {
    addAddress,
    addAddresspost
}


