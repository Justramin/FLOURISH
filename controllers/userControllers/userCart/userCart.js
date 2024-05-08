



const userCart = async(req,res)=>{
    try {
        res.render('userCart',{isUser:req.session.isUser})
    } catch (error) {
        console.error('Error in userCart:', error);
        res.redirect('/userError')
    }  
}



module.exports = {
    userCart
}