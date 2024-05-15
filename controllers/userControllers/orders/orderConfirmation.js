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
        const orderData = await orderCollection.find({userID:req.session.isUser._id});
        res.render('orderHistory',{isUser:req.session.isUser,data:orderData});
    }catch(error){
        console.error('Error in orderHistory :',error);
        res.redirect('/userError');
    }
}

const orderDetail =async (req,res)=>{
    try{
        const orderData = await orderCollection.findOne({orderID:req.params.id});
        res.render('orderDetails',{isUser:req.session.isUser,data:orderData});
    }catch(error){
        console.error('Error in orderDetail :',error);
        res.redirect('/userError');
    }
}


const cancelProducts = async (req, res) => {
    try {    
        const data = await orderCollection.findOne({orderID: req.query.id})
        const updateData = data.products[req.query.i]
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
        res.redirect(`/orderDetail/${req.query.id}`);
    } catch (error) {
        console.error('Error in cancelProducts:', error);
        res.redirect('/userError');
    }
}




module.exports = {
    orderConfirmation,
    orderHistory,
    orderDetail,
    cancelProducts
}