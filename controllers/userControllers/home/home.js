const productCollection = require("../../../model/productSchema");



const home = async(req,res)=>{
    try {
        const productData = await productCollection.find({}).sort({_id:-1}).limit(8);
        res.render('home',{isUser:req.session.isUser,
                            productData:productData,
                           })
    } catch (error) {
        console.error('Error in home:', error);
        res.redirect('/userError')
    }  
}




module.exports = {
    home
}