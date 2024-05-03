



const userError = async(req,res)=>{
    try {
        
        res.render('404Error',{isUser:req.session.isUser})
    } catch (error) {
        console.error('Error in 404 userError:', error);
        res.status(500).send('Internal Error');
    }  
}




module.exports = {
    userError
}