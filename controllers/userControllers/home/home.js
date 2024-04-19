


const home = async(req,res)=>{
    try {
        console.log(req.session.isUser);
        res.render('home',{isUser:req.session.isUser})
    } catch (error) {
        console.error('Error in home:', error);
        res.status(500).send('Internal Error');
    }  
}




module.exports = {
    home
}