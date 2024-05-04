const addressCollection = require("../../../model/adressSchema");




const addAddress = async(req,res)=>{
    try {
        
        console.log(req.session.isUser);
        res.render('addAddress',{isUser:req.session.isUser})
    } catch (error) {
        console.error('Error in addAddress:', error);
        res.redirect('/userError')
    }  
}




const addAddresspost = async(req,res)=>{
    try {
        const addressData = req.body
        addressData.userID =req.session.isUser._id
        console.log(addressData,'===============body address');
        const addAddress =await addressCollection.create(addressData)
        res.redirect('/profilePage')
        console.log(addAddress,'======-------======await address');
    } catch (error) {
        console.error('Error in addAddresspost:', error);
        res.redirect('/userError')
    }  
}


module.exports = {
    addAddress,
    addAddresspost
}


