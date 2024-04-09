
const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    name:{
        type:String,
        //required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    },
    superAdmin:{
        type:Boolean,
        default:false
    }
    
})
const adminCollection = new mongoose.model('admin',schema)
module.exports = adminCollection

