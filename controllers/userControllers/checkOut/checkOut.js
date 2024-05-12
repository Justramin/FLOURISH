



const checkOut = async(req,res)=>{
    try {
        res.render('checkOut',{isUser:req.session.isUser})
    } catch (error) {
        console.error('Error in checkOut:', error);
        res.redirect('/userError')
    }
    
}



module.exports = {
    checkOut
}