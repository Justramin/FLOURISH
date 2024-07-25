const { session } = require("passport");
const orderCollection = require("../../../model/orderSchema");
const productCollection = require("../../../model/productSchema");
const walletCollection = require("../../../model/walletSchema");
const { Long } = require("mongodb");





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
        const {id,index} = req.params
        const orderData = await orderCollection.findOne({orderID:id});
       
        
        if (!orderData) {
            return res.render('orderDetails', { isUser: req.session.isUser, data: null, error: 'Order not found' });
        }
        res.render('orderDetails',{isUser:req.session.isUser,data:orderData,index:index, error: null });
    }catch(error){
        console.error('Error in orderDetail :',error);
        res.redirect('/userError');
    }
}


const cancelProducts = async (req, res) => {
    try {    
      
        const {id,i} = req.query
        const data = await orderCollection.findOne({orderID:id})
        const updateData = data.products[i]

        const numProducts = data.products.length;
        const discountPerProduct = data.discount / numProducts;
        const adjustedProductTotal = updateData.Product_total - discountPerProduct;
               
        const orderData = await orderCollection.updateOne({ orderID: req.query.id }, 
            {
            $set: {
                [`products.${req.query.i}.status`]: 'Cancelled',
                [`products.${req.query.i}.cancel`]: true
            }
        });
        
        await productCollection.updateOne(
            { productName: updateData.productName },
            {
                $inc: { stock: updateData.quantity }
            }
        );


        if(data.paymentMethod !=='COD'){
              
            const walletTransactions = {
                remarks: 'User cancel a product',
                date:new Date(),
                type:'Credit',
                amount:adjustedProductTotal,
            }
            const wallet = await walletCollection.updateOne({userId:req.session.isUser._id},{$inc:{wallet: +adjustedProductTotal},$addToSet:{walletTransactions:walletTransactions}},{upsert:true})

        }
        

        // Redirect or render response
        res.redirect(`/orderTracking/${id}/${i}`);
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




const ReturnReason = async (req, res) => {
    try {
  
        const { orderID, index, reason } = req.body;
        const order = await orderCollection.findOne({orderID:orderID})
      
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (index < 0 || index >= order.products.length) {
            return res.status(400).json({ message: 'Invalid product index' });
        }


         await orderCollection.updateOne({ orderID: orderID }, 
            {
            $set: {
                [`products.${index}.status`]: `${'Return'}` ,
                [`products.${index}.returnReason`]: reason
            }
        });


        res.status(200).json({ message: 'Order return request processed successfully' })
    } catch (error) {
        console.error('Error in ReturnReason:', error);
        res.redirect('/userError');
    }
}



const reviewRating = async (req, res) => {
    try {

        const { id} = req.query;
        const { rating, review } = req.body;
        const date = new Date
        const userId = req.session.isUser._id;
    
        const productId = id;
    
        const product = await productCollection.findById(productId);
    
        if (!product) {
          res.render("/userError")
        }
    
        const existingUserRating = product.userRatings.find(
          (userRating) => userRating.userId.toString() === userId
        );
    
        if (existingUserRating) {
          existingUserRating.rating = rating;
          existingUserRating.review = review;
          existingUserRating.date = date;
          
        } else {
          product.userRatings.push({ userId, rating, review, date });
        }

        const totalRatings = product.userRatings.reduce((acc, cur) => acc + cur.rating, 0);
        const averageRating = totalRatings / product.userRatings.length;


     
        product.ratingNumber = averageRating;
    
        await product.save();
   
        res.redirect("/orderHistory");
    } catch (error) {
        console.error('Error in reviewRating:', error);
        res.redirect('/userError');
    }
}


module.exports = {
    orderConfirmation,
    orderHistory,
    orderTracking,
    cancelProducts,
    invoice,
    ReturnReason,
    reviewRating
}

