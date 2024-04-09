
const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    categoryName:{
        type:String,
        required:true
    },
    discount:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }
    
})
const category = new mongoose.model('category',schema)
module.exports = category

