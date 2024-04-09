
const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    discription:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    }, 
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
   
    offerPrice:{
        type:Number,
        required:true
    },
    image:{
        type:Array,
        required:false
    }, 
    status:{
        type:Boolean,
        default:true
    }
    
})
const productCollection = new mongoose.model('product',schema)
module.exports = productCollection

