


const home = async(req,res)=>{
    try {
        res.render('home',{isUser:req.session.isUser})
    } catch (error) {
        console.error('Error in home:', error);
        res.redirect('/userError')
    }  
}




module.exports = {
    home
}