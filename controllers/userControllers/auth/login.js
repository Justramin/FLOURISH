const collection = require("../../../model/userSchema");




const user_login = async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.error('Error in user_login:', error);
        res.status(500).send('Internal Error');
    }
    
}



const user_loginPost = async(req,res)=>{
    const loginData = req.body
    console.log(loginData);
    const user = await collection.findOne({email:loginData.email})
    console.log(user);
    if(user && user.password === loginData.password){
        if(!user.status){
            req.session.isUser=false;
            req.flash('error', 'Admin Blocked You');
            return res.redirect('/login')
        }
        req.session.isUser=user
        return res.redirect('/')
    }else{
        req.flash('error', 'Invalid Username or Password');
        return res.redirect('/login')
    }
}


const user_logOut = async(req,res)=>{
    try {
        req.session.isUser=false;
        req.session.destroy();
        res.redirect('/')
    } catch (error) {
        console.error('Error in user_logOut:', error);
        res.status(500).send('Internal Error');
    }
}




module.exports = {
    user_login,
    user_loginPost,
    user_logOut
}