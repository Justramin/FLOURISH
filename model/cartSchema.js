const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        require : true
    },
    items : [ 
        {
           productId : {
               type : mongoose.Schema.Types.ObjectId,
               ref : 'product',
               require : true
           },
           Image : {
               type : String , 
               require : true
           },
           quantity : {
               type : Number,
               require : true
           },
           stock : {
               type : Number,
               require : true
           },
           price : {
               type : Number,
               required : true
           },
           Product_total : {
               type : Number,
               require : true
           }
       }
   ] ,
     Cart_total : {
        type : Number,
        require : true
     }

} , {strictPopulate : false } )

const cartCollection=new mongoose.model('cart' , cartSchema )


module.exports = cartCollection ;