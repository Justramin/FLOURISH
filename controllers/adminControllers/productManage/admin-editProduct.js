
const productCollection = require('../../../model/productSchema')
const categoryCollection = require('../../../model/categorySchema')
const offerCollection = require('../../../model/offersSchema')
const mongoose = require('mongoose');


const admin_editProduct = async(req,res)=>{
    try {
       
            const productId = req.params.id
            const categoryData = await categoryCollection.find()
            const productData = await productCollection.findOne({_id:productId}).populate('offers');
            const offers = await offerCollection.find()
            res.render('admin-editProduct',{
                product:productData,
                category:categoryData,
                offers: offers,
                isSuperAdmin:req.session.isSuperAdmin})
       
    } catch (error) {
        console.error('Error in admin_editProduct:', error);
        res.redirect('/admin/errorPage')
    }
}



const admin_editProductPut = async(req,res)=>{
    try {
            const productID = new mongoose.Types.ObjectId(req.params.id);
            const productData = req.body


        const { productName , discription, category, price, stock, selectedOffer } = productData;
        const priceNumber = Number(price);
        const stockNumber = Number(stock);
            
            const productRegex = new RegExp(`^${productName}$`,'i')
            const existingProduct = await productCollection.findOne({productName:{$regex:productRegex}})

             
            if(!existingProduct || existingProduct._id.toString() === productID.toString()){

                let offerPriceNumber = priceNumber;
                let offer
                if (selectedOffer) {
                     offer = await offerCollection.findById(selectedOffer); // Assuming offerCollection is defined
                    if (offer) {
                        const discountPercentage = offer.discount || 0; // Default to 0 if not set
                        offerPriceNumber = priceNumber * (1 - discountPercentage / 100);
                    }
                }


                //Images
             const files = req.files;
             const images = [];
             files.forEach((file) => {
               const image = file.filename;
               images.push(image);
             });





                await productCollection.updateOne({_id:productID},{$set:{
                    productName:productName,
                    discription:discription,
                    category:category,
                    price:price,
                    stock:stock,
                    offers:offer||null ,
                    offerPrice:offerPriceNumber
                 }})
                 
                await productCollection.updateOne({_id: productID}, {
                    $push: { image: { $each: images } }
                });
                 res.redirect('/admin/admin-productManage')
            }else{
                req.flash('error', 'product Name already Exist');
                res.redirect(`/admin/admin_editProduct/${productID}`)
            }
            
     
    } catch (error) {
        console.error('Error in admin_editProductPut:', error);
        res.redirect('/admin/errorPage')
    }
    
}



const productImageDelete = async(req,res)=>{
    try {
       
            const productID = req.params.id
            const imagePath = req.query.index
            const imageDElete = await productCollection.updateOne({_id:productID},{$pull:{image:imagePath}})
            res.redirect(`/admin/admin_editProduct/${productID}`);
       
    } catch (error) {
        console.error('Error in productImageDelete:', error);
        res.redirect('/admin/errorPage')
    } 
}





module.exports ={
    admin_editProduct,
    admin_editProductPut,
    productImageDelete
}