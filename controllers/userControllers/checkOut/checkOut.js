const addressCollection = require("../../../model/adressSchema");
const cartCollection = require("../../../model/cartSchema");
const orderCollection = require("../../../model/orderSchema");
const productCollection = require("../../../model/productSchema");
const userCollection = require("../../../model/userSchema");
const otpGenerator = require('otp-generator')
const Razorpay = require('razorpay')
const dotenv = require('dotenv');


dotenv.config()

// RazorPay key id and key secret 
var instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
});



const checkOut = async(req,res)=>{
    try {
        const cartData = await cartCollection.findOne({userId:req.session.isUser._id}).populate('items.productId')
        const addressData = await addressCollection.findOne({userID:req.session.isUser._id});
        let outOfStock = false;
        for(let i=0;i<cartData.items.length;i++){
            const data = await productCollection.findOne({_id:cartData.items[i].productId});
            if(data.stock === 0){
                outOfStock = true;
                break
            }
        }
        if(outOfStock){
            res.json({ outOfStock: outOfStock });
        }else{
            res.render('checkOut',{isUser:req.session.isUser,data:cartData,address:addressData})
        }
        
    } catch (error) {
        console.error('Error in checkOut:', error);
        res.redirect('/userError')
    }
    
}







const checkOutPost = async(req,res)=>{
    try {
        const { cartId } = req.body;
        const cartData = await cartCollection.findOne({userId:req.session.isUser._id}).populate('items.productId')
        const addressData = await addressCollection.findOne({userID:req.session.isUser._id});
        let outOfStock = false;
        for(let i=0;i<cartData.items.length;i++){
            const data = await productCollection.findOne({_id:cartData.items[i].productId});
            if(data.stock === 0){
                outOfStock = true;
                break
            }
        }
        if(outOfStock){
            res.json({ outOfStock: outOfStock });
        }else{
            res.json({ outOfStock: '' });
            // res.render('checkOut',{isUser:req.session.isUser,data:cartData,address:addressData})
        }
        
    } catch (error) {
        console.error('Error in checkOut:', error);
        res.redirect('/userError')
    }
    
}


const placeOrder = async (req,res)=>{
    try{
        const index = Number(req.query.address)
        const paymentMethod = req.query.payment
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
            let discountPrice;
            if(req.session.finalPrice){
                discountPrice =cartData.Cart_total - req.session.finalPrice 
            }else{
                discountPrice =0
            }
            
        const newOrder = new orderCollection({
            userID:req.session.isUser._id,
            orderID:orderId,
            user:address.name,
            totalOrderValue: req.session.finalPrice || cartData.Cart_total,
            discount:discountPrice,
            address:address,
            paymentMethod:paymentMethod,
            date: new Date(),
            products:productData,
            status:"Pending"
        })

        await newOrder.save();

        await userCollection.findByIdAndUpdate(req.session.isUser._id,
            { $addToSet: { usedCoupons: req.session.couponCode } },
            { new: true });

            req.session.finalPrice = null
            req.session.couponCode = null



        await cartCollection.deleteOne({userId:req.session.isUser._id});

            res.json({result:'success',orderId:orderId})
        // res.redirect(`/orderConfirmation?id=${orderId}`)
    }catch(error){
        console.error('Error in checkOutPost',error);
        res.redirect('/userError');
    }
}




const newAddressCheckOut = async(req,res)=>{
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

        res.redirect('/checkOut')
        
    } catch (error) {
        console.error('Error in newAddressCheckOut:', error);
        res.redirect('/userError')
    }  
}




const checkOutEditeAddress = async(req,res)=>{
    try {
        const adressIndex = req.params.id
        const userAddress = await addressCollection.findOne({ userID: req.session.isUser._id })
        const userAddressData = userAddress.address[adressIndex];
        res.render('checkOutEditeAddress',{isUser:req.session.isUser,adressData:userAddressData})
    } catch (error) {
        console.error('Error in editeAddress:', error);
        res.redirect('/userError')
    }
}



const checkOutediteAddressPost = async(req,res)=>{
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
        res.redirect('/checkOut')
    } catch (error) {
        console.error('Error in checkOutediteAddressPost:', error);
        res.redirect('/userError')
    }  
}




const checkOutdeleteAddress = async(req,res)=>{
    try {
        const userAddress = await addressCollection.findOne({ userID: req.session.isUser._id });
        const addressData = userAddress.address[req.params.id];
        const result = await addressCollection.updateOne(
            { _id: userAddress._id },
            { $pull: { address: addressData } }
        )
        res.redirect('/checkOut')
    } catch (error) {
        console.error('Error in checkOutdeleteAddress:', error);
        res.redirect('/userError')
    }
}





module.exports = {
    checkOut,
    checkOutPost,
    placeOrder,
    newAddressCheckOut,
    checkOutEditeAddress,
    checkOutediteAddressPost,
    checkOutdeleteAddress
    
}