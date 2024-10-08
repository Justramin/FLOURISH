
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
        type:mongoose.Schema.Types.ObjectId,
        ref:'category',
        required:true
    }, 
    offers:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'offers',
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
        
    },
    image:{
        type:Array,
        required:false
    }, 
    status:{
        type:Boolean,
        default:true
    },
    ratingNumber:{
        type:Number,
        default:0
    },
    userRatings: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
            rating: { type: Number },
            review: { type: String },
              date: { type: Date },
        },
    ]
    
})
const productCollection = new mongoose.model('product',schema)
module.exports = productCollection

