  const mongoose=require('mongoose')

const walletSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required : true
    },
    wallet: {
      type: Number,
      default: 0,
    },
    walletTransactions: [
      {
        remarks:{type:String},
        date: { type: Date },
        type: { type: String },
        amount: { type: Number },
      },
    ],
  });
  
  const walletCollection=mongoose.model('wallets',walletSchema)

  module.exports=walletCollection;