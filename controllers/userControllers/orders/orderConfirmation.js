const orderCollection = require("../../../model/orderSchema");
const productCollection = require("../../../model/productSchema");





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
        const orderData = await orderCollection.find({userID:req.session.isUser._id}).populate('products')

        res.render('orderHistory',{isUser:req.session.isUser,data:orderData});
    }catch(error){
        console.error('Error in orderHistory :',error);
        res.redirect('/userError');
    }
}

const orderDetail =async (req,res)=>{
    try{
        const orderData = await orderCollection.findOne({orderID:req.params.id});
        if (!orderData) {
            console.error('Order not found');
            return res.render('orderDetails', { isUser: req.session.isUser, data: null, error: 'Order not found' });
        }
        
        res.render('orderDetails',{isUser:req.session.isUser,data:orderData, error: null });
    }catch(error){
        console.error('Error in orderDetail :',error);
        res.redirect('/userError');
    }
}


const cancelProducts = async (req, res) => {
    try {    
        console.log(req.query);
        const data = await orderCollection.findOne({orderID: req.query.id})
        const updateData = data.products[req.query.i]
        console.log(updateData);
                // Await the update operation
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

        // Redirect or render response
        res.redirect('/orderHistory');
    } catch (error) {
        console.error('Error in cancelProducts:', error);
        res.redirect('/userError');
    }
}


const invoice =async (req,res)=>{
    try{
        const orderId = req.params.id
        const orderData = await orderCollection.findOne({orderID:orderId})

        res.render('orderInvoice',{isUser:req.session.isUser,data:orderData});
    }catch(error){
        console.error('Error in invoice :',error);
        res.redirect('/userError');
    }
}



module.exports = {
    orderConfirmation,
    orderHistory,
    orderDetail,
    cancelProducts,
    invoice
}

