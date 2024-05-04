




const address = async(req,res)=>{
    try {

        res.render('address',{isUser:req.session.isUser})
    } catch (error) {
        console.error('Error in address:', error);
        res.redirect('/userError')
    }  
}




module.exports = {
    address
}


