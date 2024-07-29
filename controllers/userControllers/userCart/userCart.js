const { response } = require("express");
const cartCollection = require("../../../model/cartSchema");
const productCollection = require("../../../model/productSchema");
const flash = require("express-flash");




const userCart = async(req,res)=>{
    try {
        const cartData = await cartCollection.findOne({userId:req.session.isUser._id}).populate('items.productId')
        res.render('userCart',{isUser:req.session.isUser,cartData:cartData})
    } catch (error) {
        console.error('Error in userCart:', error);
        res.redirect('/userError')
    }  
}




const addToCart = async (req,res)=>{
    try{
        if(!req.session.isUser){
            res.setHeader('Content-Type', 'application/json'); // Set the content type header
            res.json({ success: false }); // Send JSON response with success flag
        }else{
            let message = ""
            const productData = await productCollection.findOne({_id:req.body.id});
            const quantity = req.body.quantity || 1
            const totalPrice = quantity * productData.offerPrice
            const cartData = await cartCollection.findOne({userId:req.session.isUser._id});
             
            const items = {
                productId:req.body.id,
                quantity:req.body.quantity || 1,
                stock:productData.stock,
                price:productData.offerPrice,
                Image:productData.image[0],
                Product_total: totalPrice,
        }
        let cartTotal = totalPrice;

        


        if(cartData){
            let itemExists = true;
            for(let i=0;i<cartData.items.length;i++){
                if(cartData.items[i].productId.equals(productData._id)) {

                    if(productData.stock >= cartData.items[i].quantity+quantity){
                        const newQuantity = cartData.items[i].quantity + quantity;
                        const newProductTotal = newQuantity * productData.offerPrice;
                        if(newQuantity > 5){
                            itemExists = false;
                        message ="Only 5 items can be added"
                        break;
                        }
                        const updateCart = await cartCollection.updateOne(
                            { userId: req.session.isUser._id, "items.productId": productData._id },
                            {
                                $set: { [`items.${i}.quantity`]: newQuantity, [`items.${i}.Product_total`]: newProductTotal },
                                $inc: { Cart_total: totalPrice }
                            }
                        );
                        itemExists = false;
                        message ="Product added! Quantity increased in your cart."
                        break;  
                    }else{
                        itemExists = false;
                        message ="Out of stock"
                        break;  
                    }
                    
                }
            }
            if(itemExists){
                cartData.items.push(items);
                cartTotal += cartData.Cart_total;
                await cartCollection.updateOne(
                    { userId: req.session.isUser._id },
                    { $set: { items: cartData.items, Cart_total: cartTotal } }
                );
                message = "Product added to your cart.";
            }

        }else{
            const newCart = new cartCollection({
                userId:req.session.isUser._id,
                items:[items] ,
                Cart_total: cartTotal,
            })
            await newCart.save()
            message = "Product added to your cart."
        }
        res.setHeader('Content-Type', 'application/json'); // Set the content type header
        res.status(200).json({ success: true,message:`${message}` }); // Send JSON response with success flag
        }
    }catch(error){
        console.error('Error in addToCart:',error)
        res.redirect('/userError');
    }
}






const updateQuantity = async (req, res) => {
    try {
        const { productId} = req.params;
        const { action, cartId } = req.body;

        const cart = await cartCollection.findOne({ _id: cartId });
        const itemIndex = cart.items.findIndex(item => item._id == productId);

        if(itemIndex === -1) {
            return res.status(404).json({ success: false, error: 'Item not found in cart' });
        }

        const currentQuantity = cart.items[itemIndex].quantity;
        const stockLimit = cart.items[itemIndex].stock;
        const price = cart.items[itemIndex].price;
        const opid = cart.items[itemIndex].productId;
        const product = await productCollection.findOne({ _id: opid });
        const stockLimit2 = product.stock;

        let updatedQuantity;

        if(action == '1') {
            updatedQuantity = currentQuantity + 1;
        } else if(action == '-1') {
            updatedQuantity = currentQuantity - 1;
        } else {
            return res.status(400).json({ success: false, error: "Invalid action!!" });
        }

        if(updatedQuantity > 5){
            return res
                .status(400)
                .json({ success: false, error: "Only 5 items in a single order" });
        }
        else if(updatedQuantity > stockLimit2 && action == '1') {
            return res
                .status(400)
                .json({ success: false, error: "Quantity exceeds stock limits" });
        } else if (updatedQuantity == 0) {
            return res
                .status(400)
                .json({ success: false, error: "Quantity cannot be zero" });
        }


        cart.items[itemIndex].quantity = updatedQuantity;

        const newProductTotal = price * updatedQuantity;
        cart.items[itemIndex].Product_total = newProductTotal;

        // Update Cart_total
        cart.Cart_total = cart.items.reduce((total, item) => total + item.Product_total, 0);

        await cart.save();

        res.json({
            success: true,
            newQuantity: updatedQuantity,
            newProductTotal,
            total: cart.Cart_total,
        });

    } catch (error) {
        console.error("updateCart error:", error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}





const removeToCart = async(req,res)=>{
    try {
        function calculateCartTotal(items) {
            let total = 0;
            items.forEach(item => {
                total += item.Product_total;
            });
            return total;
        }



        const index = req.params.id
        const cartData = await cartCollection.findOne({userId:req.session.isUser._id})
        cartData.items.splice(index,1)
        const newCartTotal = calculateCartTotal(cartData.items);
        cartData.Cart_total = newCartTotal;
        await cartData.save()
        res.redirect('/userCart');
    } catch (error) {
        console.error('Error in removeToCart:', error);
        res.redirect('/userError')
    }  
    
}



module.exports = {
    userCart,
    addToCart,
    updateQuantity,
    removeToCart
}


