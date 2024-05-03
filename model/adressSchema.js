const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    userID: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required : true
    },
    address : [{
        name : {
            type : String,
            required : true 
        },
        email : {
            type : String,
            required : true
        },
        mobile : {
            type : Number,
            required : true
        },
        housename : {
            type : String,
            required : true
        },
        street : {
            type : String,
            required : true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        save_as: {
            type: String,
            required: true
        },
        default: {
            type: Boolean,
            default: false
        },
    }]
})

const addressCollection = new mongoose.model('address' , addressSchema)

module.exports = addressCollection
