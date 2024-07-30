

const mongoose = require('mongoose')


const bannerSchema = new mongoose.Schema({
    bannerName:{
        type:String,
        required:true
    },
  description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:false
    },
    status:{
        type:Boolean,
        default:true
    }, 
   
})


const bannerCollection = new mongoose.model('banner',bannerSchema)
module.exports = bannerCollection