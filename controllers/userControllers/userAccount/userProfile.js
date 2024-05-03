



const userProfile = async(req,res)=>{
    try {
        
        res.render('userProfile',{isUser:req.session.isUser})
    } catch (error) {
        console.error('Error in userProfile:', error);
        res.status(500).send('Internal Error');
    }  
}




module.exports = {
    userProfile
}