const addressCollection = require("../../../model/adressSchema")







const editeAddress = async(req,res)=>{
    try {
        const adressIndex = req.params.id
        const userAddress = await addressCollection.findOne({ userID: req.session.isUser._id })
        const userAddressData = userAddress.address[adressIndex];
        res.render('editAddress',{isUser:req.session.isUser,adressData:userAddressData})
    } catch (error) {
        console.error('Error in editeAddress:', error);
        res.redirect('/userError')
    }
}



const editeAddressPost = async(req,res)=>{
    try {
        const data = req.body
        const addressId = req.query.id
        const userId = req.session.isUser._id
        const result = await addressCollection.updateOne({ 
            'userID' : userId , 'address._id' : addressId } ,
            {
                $set : {
                    'address.$.save_as' :data.saveas,
                    'address.$.name':data.name,
                    'address.$.email':data.email,
                    'address.$.mobile':data.mobile,
                    'address.$.housename':data.housename,
                    'address.$.street':data.street,
                    'address.$.pincode':data.pincode,
                    'address.$.city':data.city,
                    'address.$.state':data.state,
                    'address.$.country':data.country,
                }
            }
        )
        res.redirect('/address')
    } catch (error) {
        console.error('Error in editeAddressPost:', error);
        res.redirect('/userError')
    }  
}






const deleteAddress = async(req,res)=>{
    try {
        const userAddress = await addressCollection.findOne({ userID: req.session.isUser._id });
        console.log(userAddress)
        const addressData = userAddress.address[req.params.id];
        console.log(addressData,"-----",req.params.id);
        const result = await addressCollection.updateOne(
            { _id: userAddress._id },
            { $pull: { address: addressData } }
        )
        res.redirect('/address')
    } catch (error) {
        console.error('Error in deleteAddress:', error);
        res.redirect('/userError')
    }
}




module.exports = {
    editeAddress,
    editeAddressPost,
    deleteAddress
}