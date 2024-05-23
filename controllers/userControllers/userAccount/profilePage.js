

const profilePage = async(req,res)=>{
    try {
        if(req.session.isUser){
            res.render('profilePage',{isUser:req.session.isUser})
        }else{
            res.redirect('/login')
        }
    } catch (error) {
        console.error('Error in profilePage:', error);
        res.redirect('/userError');
    }  
}






module.exports = {
    profilePage,
}