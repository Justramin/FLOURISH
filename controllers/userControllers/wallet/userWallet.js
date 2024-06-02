



const userWallet = async (req, res) => {
    try {
        console.log('entering,,...........aayii monee......');
        res.render('userWallet2',{isUser:req.session.isUser})

    } catch (error) {
        console.error('Error in userWallet:', error);
        res.redirect('/userError');
    }
}



module.exports ={
    userWallet,
}