const addressCollection = require("../../../model/adressSchema");




const addAddress = async(req,res)=>{
    try {
        res.render('addAddress',{isUser:req.session.isUser})
    } catch (error) {
        console.error('Error in addAddress:', error);
        res.redirect('/userError')
    }  
}




const addAddresspost = async(req,res)=>{
    try {
        const userAddress = req.body
        const userAddressData = await addressCollection.find({ userID:req.session.isUser._id});

        let addressData = {
            name: userAddress.name,
            mobile: userAddress.mobile,
            email: userAddress.email,
            housename: userAddress.housename,
            street: userAddress.street,
            state: userAddress.state,
            pincode: userAddress.pincode,
            city: userAddress.city,
            country: userAddress.country,
            save_as: userAddress.saveas
        };

        if (userAddressData.length > 0) {

            const data = await addressCollection.updateOne(
                { _id: userAddressData[0]._id },
                { $push: { address: addressData } },
            );
        } else {
            let address = new addressCollection({
                userID: req.session.isUser._id,
                address: [addressData]
            })

            await address.save()
        }

        res.redirect('/profilePage')
        
    } catch (error) {
        console.error('Error in addAddresspost:', error);
        res.redirect('/userError')
    }  
}


module.exports = {
    addAddress,
    addAddresspost
}


