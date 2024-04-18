
const productCollection = require('../../../model/productSchema')
const { ObjectId } = require('mongodb')




const admin_productManage = async (req,res)=>{
    try {
        if(req.session.isAdminAuth){
            await productCollection.find({}).populate('category')
            res.render('admin-productManage',{product:productData})
        }else{
            res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.error('Error in admin_productManage:', error);
        res.status(500).send('Internal Error');
    }
}


const admin_productStatus = async(req,res)=>{
    try {
        if(req.session.isAdminAuth){
            const productId = req.params.id
            const productStatus = req.query.status
            let productData;
            if(req.session.isAdminAuth){
                if(productStatus=="true"){
                    await productCollection.updateOne({_id:new ObjectId(productId)},{$set:{status:false}})
                }else{
                    await productCollection.updateOne({_id:new ObjectId(productId)},{$set:{status:true}})
                }
                res.redirect('/admin/admin-productManage')
            }else{
                res.redirect('/admin/admin-login')
            } 
        }
    } catch (error) {
        console.error('Error in admin_productStatus:', error);
        res.status(500).send('Internal Error');
    }
}





module.exports = {
    admin_productManage,
    admin_productStatus

}