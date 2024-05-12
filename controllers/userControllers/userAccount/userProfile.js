const userCollection = require("../../../model/userSchema");




const userProfile = async(req,res)=>{
    try {
        
        res.render('userProfile',{isUser:req.session.isUser})
    } catch (error) {
        console.error('Error in userProfile:', error);
        res.redirect('/userError')
    }  
}

const userProfilePost = async(req,res)=>{
    try {
        await userCollection.updateOne({_id:req.session.isUser._id},{$set:{name:req.body.username,phone:req.body.phone}},{ upsert: true })
        const newUserData = await userCollection.findOne({_id:req.session.isUser._id})
        req.session.isUser = newUserData
        res.redirect('/profilePage')
    } catch (error) {
        console.error('Error in profileeditePost:', error);
        res.redirect('/userError');
    }  
}


module.exports = {
    userProfile,
    userProfilePost
}