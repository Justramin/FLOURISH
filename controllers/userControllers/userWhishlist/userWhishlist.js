const whishlistCollection = require("../../../model/whishlistSchema");



const userWhishlist = async(req,res)=>{
    try {
        const isUser = req.session.isUser
        const whishlist = await whishlistCollection.findOne({useruserId:isUser._id})
        console.log(whishlist);
        res.render('whishlistManage',{isUser:isUser,whishlislData:whishlist})
    } catch (error) {
        console.error('Error in userWhishlist:', error);
        res.redirect('/userError')
    }  
}


module.exports = {
    userWhishlist
}