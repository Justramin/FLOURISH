const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'user',
        require : true
    },
    items : [ 
        {
           productId : {
               type : Schema.Types.ObjectId,
               ref : 'product',
               require : true
           },
           stock : {
               type : Number , 
               require : true
           },
           quantity : {
               type : Number,
               require : true
           },
           size : {
               type : String,
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