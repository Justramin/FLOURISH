



const user_login = async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.error('Error in user_login:', error);
        res.status(500).send('Internal Error');
    }
    
}



module.exports = {
    user_login
}