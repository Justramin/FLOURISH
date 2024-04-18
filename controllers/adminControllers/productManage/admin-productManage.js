
const productCollection = require('../../../model/productSchema')
const { ObjectId } = require('mongodb')
const categoryCollection = require('../../../model/categorySchema')




const admin_productManage = async (req,res)=>{
    if(req.session.isAdminAuth){
        // const productData = await productCollection.find()
        // res.render('admin-productManage',{product:productData})
        // const productData = await productCollection.aggregate([
        //     {
        //         $lookup:{
        //             from:'category',
        //             localField:'category',
        //             foreignField:'_id',
        //             as:'category'
        //         }
        //     }
        // ])


        const productData = await productCollection.find({}).populate('category')
        console.log(productData);
        res.render('admin-productManage',{product:productData})
    }else{
        res.redirect('/admin/admin-login')
    }
}


const admin_productStatus = async(req,res)=>{
    if(req.session.isAdminAuth){
        const productId = req.params.id
        const productStatus = req.query.status
    
        if(req.session.isAdminAuth){
            let productData;
            if(productStatus=="true"){
                productData = await productCollection.updateOne({_id:new ObjectId(productId)},{$set:{status:false}})
            }else{
                productData = await productCollection.updateOne({_id:new ObjectId(productId)},{$set:{status:true}})
            }
            res.redirect('/admin/admin-productManage')
        }else{
            res.redirect('/admin/admin-login')
        }
        
    }
    }









module.exports = {
    admin_productManage,
    admin_productStatus

}