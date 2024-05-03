




const address = async(req,res)=>{
    try {

        res.render('address',{isUser:req.session.isUser})
    } catch (error) {
        console.error('Error in profilePage:', error);
        res.status(500).send('Internal Error');
    }  
}




module.exports = {
    address
}


