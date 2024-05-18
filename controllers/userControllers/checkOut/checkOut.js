const addressCollection = require("../../../model/adressSchema");
const cartCollection = require("../../../model/cartSchema");
const orderCollection = require("../../../model/orderSchema");
const productCollection = require("../../../model/productSchema");
const userCollection = require("../../../model/userSchema");
const otpGenerator = require('otp-generator')




const checkOut = async(req,res)=>{
    try {
        const cartData = await cartCollection.findOne({userId:req.session.isUser._id}).populate('items.productId')
        const addressData = await addressCollection.findOne({userID:req.session.isUser._id});
        res.render('checkOut',{isUser:req.session.isUser,data:cartData,address:addressData})
    } catch (error) {
        console.error('Error in checkOut:', error);
        res.redirect('/userError')
    }
    
}


const placeOrder = async (req,res)=>{
    try{
        const index = Number(req.query.address)
        const userData = await userCollection.findOne({_id:req.session.isUser._id});
        const cartData = await cartCollection.findOne({userId:req.session.isUser._id}).populate('items.productId')
        const addressData = await addressCollection.findOne({userID:req.session.isUser._id});
        const address = addressData.address[index]


        const orderId = otpGenerator.generate(16,
            {
                upperCaseAlphabets:false,
                specialChars:false,
                lowerCaseAlphabets:false
            })

            let productData= []

            for (let i = 0; i < cartData.items.length; i++) {
                await productCollection.updateOne(
                    { _id: cartData.items[i].productId },
                    {
                        $inc: { stock: -cartData.items[i].quantity } // Decrement the 'stock' field by cartData.items[i].quantity
                    }
                );
                

                let obj={
                    productName:cartData.items[i].productId.productName,
                    Image:cartData.items[i].Image,
                    quantity:cartData.items[i].quantity,
                    price:cartData.items[i].price,
                    Product_total:cartData.items[i].Product_total,
                    status:"Pending"
                }
                productData.push(obj);
            }
            
            
        const newOrder = new orderCollection({
            userID:req.session.isUser._id,
            orderID:orderId,
            user:address.name,
            totalOrderValue:cartData.Cart_total,
            address:address,
            date: new Date(),
            products:productData,
            status:"Pending"
        })

        await newOrder.save();


        await cartCollection.deleteOne({userId:req.session.isUser._id});


        res.redirect(`/orderConfirmation?id=${orderId}`)
    }catch(error){
        console.error('Error in placeOrder',error);
        res.redirect('/userError');
    }
}




const newAddressCheckOut = async(req,res)=>{
    try {
        const userAddress = req.body
        console.log(userAddress,'-------------ithe body data');
        const userAddressData = await addressCollection.find({ userID:req.session.isUser._id});
        console.log(userAddressData,'-----------------ithe database Data');

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

        res.redirect('/checkOut')
        
    } catch (error) {
        console.error('Error in newAddressCheckOut:', error);
        res.redirect('/userError')
    }  
}



module.exports = {
    checkOut,
    placeOrder,
    newAddressCheckOut,
}