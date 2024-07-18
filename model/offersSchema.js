const mongoose = require('mongoose');


const offersSchema = new mongoose.Schema({
    offerName: {
        type: String,
        required: true,
    },
    discription: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    startingDate: {
        type: Date,
        trim: true,
    },
    endingDate: {
        type: Date,
        trim: true,
    },
    status: {
        type: Boolean,
        default: true
    },
});

const offerCollection = new mongoose.model('offers', offersSchema);
module.exports = offerCollection;
