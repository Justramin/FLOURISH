const productCollection = require("../../../model/productSchema");
const whishlistCollection = require("../../../model/whishlistSchema");



const userWhishlist = async(req,res)=>{
    try {
        const isUser = req.session.isUser
        const whishlist = await whishlistCollection.findOne({userId:isUser._id})
        res.render('whishlistManage',{isUser:isUser,whishlislData:whishlist})
    } catch (error) {
        console.error('Error in userWhishlist:', error);
        res.redirect('/userError')
    }  
}

const addWhishlist = async(req,res)=>{
    try {
        if(!req.session.isUser){
            res.setHeader('Content-Type', 'application/json'); // Set the content type header
            res.json({ success: false }); // Send JSON response with success flag
        }else{
            let message = ""
            const productData = await productCollection.findOne({_id:req.body.id});
            const whishlistData = await whishlistCollection.findOne({userId:req.session.isUser._id})
            const items = {
                proId:req.body.id,
                product:productData.productName,
                Price:productData.offerPrice,
                Image:productData.image[0]
            }
            if(whishlistData){
                const alreadyExistedData = await whishlistCollection.findOne({
                    userId: req.session.isUser._id,
                    'items.proId': req.body.id // Check if the items array contains the specified product ID
                });
                if(!alreadyExistedData){
                                const data = await whishlistCollection.updateOne(
                    {userId:req.session.isUser._id},
                    {$push:{items:items}    
                    })
                message = "Added to your Wishlist"   
                }else{
                    message = "This product is already in your wishlist"
                }
            }else{
                const newWhishlist = new whishlistCollection({
                    userId:req.session.isUser._id,
                    items:[items]
                })
                await newWhishlist.save()
                message = "Added to your Wishlist"
            }
            res.setHeader('Content-Type', 'application/json'); // Set the content type header
            res.status(200).json({ success: true,message:`${message}` }); // Send JSON response with success flag
        }
    } catch (error) {
        console.error('Error in userWhishlist:', error);
        res.redirect('/userError')
    }  
}



const wishlistRemove = async(req,res)=>{
    try {
        const index = req.query.index
        const whishlistData = await whishlistCollection.findOne({userId:req.session.isUser._id})
        whishlistData.items.splice(index,1)
        await whishlistData.save()
        res.redirect('/userWhishlist')
    } catch (error) {
        console.error('Error in wishlistRemove:', error);
        res.redirect('/userError')
    }  
}




module.exports = {
    userWhishlist,
    addWhishlist,
    wishlistRemove
}