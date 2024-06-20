const collection = require("../../../model/userSchema");




const user_login = async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.error('Error in user_login:', error);
        res.redirect('/userError')
    }
    
}



const user_loginPost = async(req,res)=>{
   try {
        const loginData = req.body
        const user = await collection.findOne({email:loginData.email})
        if(user && user.password === loginData.password){
            if(!user.status){
                req.session.isUser=false;
                req.flash('error', 'Unable to login now. Please try later.');
                return res.redirect('/login')
            }
            req.session.isUser=user
            return res.redirect('/')
        }else{
            req.flash('error', 'Invalid Username or Password');
            return res.redirect('/login')
        }
   } catch (error) {
        console.error('Error in user_loginPost:', error);
        res.redirect('/userError')
   }
}




const user_logOut = async(req,res)=>{
    try {
        req.session.isUser=false;
        req.session.destroy();
        res.redirect('/')
    } catch (error) {
        console.error('Error in user_logOut:', error);
        res.redirect('/userError')
    }
}




module.exports = {
    user_login,
    user_loginPost,
    user_logOut
}