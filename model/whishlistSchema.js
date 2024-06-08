const mongoose = require('mongoose')

const whishlistSchema = new mongoose.Schema({
    userId: {
        type: String,
        required:true
    },
    items:[
        {
        proId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'product',
            required:true,
        },
        product: {
            type: String,
            required: true
        },
        Image: {
            type: String,
            required: true
        },
        Price: {
            type: Number,
            required: true
        },
}]
    

})


const whishlistCollection =new  mongoose.model('whishlist', whishlistSchema)
module.exports = whishlistCollection