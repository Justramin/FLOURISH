

const profilePage = async(req,res)=>{
    try {
        res.render('profilePage',{isUser:req.session.isUser})
    } catch (error) {
        console.error('Error in profilePage:', error);
        res.redirect('/userError');
    }  
}






module.exports = {
    profilePage,
}