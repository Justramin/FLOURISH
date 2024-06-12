const { session } = require("passport");
const orderCollection = require("../../../model/orderSchema");
const productCollection = require("../../../model/productSchema");
const walletCollection = require("../../../model/walletSchema");





const orderConfirmation =async (req,res)=>{
    try{
        const orderData = await orderCollection.findOne({orderID:req.query.id});
        res.render('orderConfirmation',{isUser:req.session.isUser,data:orderData});
    }catch(error){
        console.error('Error in orderConfirmation :',error);
        res.redirect('/userError');
    }
}

const orderHistory =async (req,res)=>{
    try{
        const orderData = await orderCollection.find({userID:req.session.isUser._id}).populate('products.product').sort({_id:-1})

        res.render('orderHistory',{isUser:req.session.isUser,data:orderData});
    }catch(error){
        console.error('Error in orderHistory :',error);
        res.redirect('/userError');
    }
}



const orderTracking =async (req,res)=>{
    try{
        const orderData = await orderCollection.findOne({orderID:req.params.id});
        console.log(orderData,'-------------------kttiyaaaa mathi enu');
        if (!orderData) {
            console.error('Order not found');
            return res.render('orderDetails', { isUser: req.session.isUser, data: null, error: 'Order not found' });
        }
        console.log('alan paranjitt pinna kelkkathirikkaan pattuvoo...');
        
        res.render('orderDetails',{isUser:req.session.isUser,data:orderData, error: null });
    }catch(error){
        console.error('Error in orderDetail :',error);
        res.redirect('/userError');
    }
}


const cancelProducts = async (req, res) => {
    try {    
        const data = await orderCollection.findOne({orderID: req.query.id})
        const updateData = data.products[req.query.i]

               
        const orderData = await orderCollection.updateOne({ orderID: req.query.id }, 
            {
            $set: {
                [`products.${req.query.i}.status`]: 'Cancelled' 
            }
        });
        
        await productCollection.updateOne(
            { productName: updateData.productName },
            {
                $inc: { stock: updateData.quantity } // Decrement the 'stock' field by cartData.items[i].quantity
            }
        );


        if(data.paymentMethod !=='COD'){
                const amount = updateData?.Product_total 
            const walletTransactions = {
                remarks: 'User cancel a product',
                date:new Date(),
                type:'Credit',
                amount:amount,
            }
            const wallet = await walletCollection.updateOne({userId:req.session.isUser._id},{$inc:{wallet: +amount},$addToSet:{walletTransactions:walletTransactions}},{upsert:true})

        }
        

        // Redirect or render response
        res.redirect('/orderHistory');
    } catch (error) {
        console.error('Error in cancelProducts:', error);
        res.redirect('/userError');
    }
}


const invoice = async (req, res) => {
    try {
        const orderId = req.params.id;

        const orderData = await orderCollection.findOne({ orderID: orderId }).populate('user');

        res.render('orderInvoice', { isUser: req.session.isUser, data: orderData });
    } catch (error) {
        console.error('Error in invoice:', error);
        res.redirect('/userError');
    }
}



module.exports = {
    orderConfirmation,
    orderHistory,
    orderTracking,
    cancelProducts,
    invoice
}

