const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
    },
    password:{
        type:String,
    },
    refferralCode:{
        type:String,
    },
    status:{
        type:Boolean,
        default:true
    },
    image:{
        type:String,
        required:false
    }, 
    usedCoupons:[{
        type: String 
    }],
    
})
const collection = new mongoose.model('user',schema)
module.exports = collection

