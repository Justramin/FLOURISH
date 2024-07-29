

const Razorpay = require("razorpay");
const KEY_ID = process.env.KEY_ID;
const KEY_SECRET = process.env.KEY_SECRET;
const instance = new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET });




const razorPay =async (req,res)=>{
    try{

        let finalPrice;
        if(req.session.finalPrice){
          finalPrice = req.session.finalPrice;
        }else{
          finalPrice = req.body.finalPrice;
        }
        var options = {
          amount: finalPrice*100,
          currency: "INR",
          receipt: "order_rcpt",
        };
        instance.orders.create(options, function (err, order) {
          res.json(order);
        });
    }catch(error){
        console.error('Error in razorPay :',error);
        res.redirect('/userError');
    }
}




module.exports ={
    razorPay,

}