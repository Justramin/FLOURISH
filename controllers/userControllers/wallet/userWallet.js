
const walletCollection = require("../../../model/walletSchema");




const userWallet = async (req, res) => {
    try {
        const wallet = await walletCollection.findOne({userId:req.session.isUser._id})

        if (wallet) {
            wallet.walletTransactions.reverse();
        }

            const currentDate = new Date();
            const year = currentDate.getFullYear().toString().slice(-2);
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const formattedDate = `${month}/${year}`;
   
            console.log(wallet);
        res.render('userwallet2',{isUser:req.session.isUser,data:wallet,date:formattedDate})

    } catch (error) {
        console.error('Error in userWallet:', error);
        res.redirect('/userError');
    }
}




const userWalletPost = async (req, res) => {
    try {
        const walletAmount = Number(req.body.walletAmount)
        const finalPrice = Number(req.session.finalPrice ||req.body.finalPrice)

        if(walletAmount >= finalPrice ){

            const amount =  finalPrice
            const walletTransactions = {
                remarks:'User purchased a Product',
                date:new Date(),
                type:'Debit',
                amount:amount,
            }
            const wallet = await walletCollection.updateOne({userId:req.session.isUser._id},{$inc:{wallet: -amount},$addToSet:{walletTransactions:walletTransactions}},{upsert:true})
            res.json({result:'Within Limit'})    
        }else{
            res.json({result:'Limit Exceeded'})
        }

       

    } catch (error) {
        console.error('Error in userWalletPost:', error);
        res.redirect('/userError');
    }
}


module.exports ={
    userWallet,
    userWalletPost
}