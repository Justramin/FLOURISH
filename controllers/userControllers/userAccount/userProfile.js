



const userProfile = async(req,res)=>{
    try {
        
        res.render('userProfile',{isUser:req.session.isUser})
    } catch (error) {
        console.error('Error in userProfile:', error);
        res.redirect('/userError')
    }  
}




module.exports = {
    userProfile
}