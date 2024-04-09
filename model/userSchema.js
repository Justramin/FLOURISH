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
        required:true
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:false
    }
    
})
const collection = new mongoose.model('user',schema)
module.exports = collection

