
const productCollection = require('../../../model/productSchema')
const { ObjectId } = require('mongodb')
const categoryCollection = require('../../../model/categorySchema')




const admin_productManage = async (req, res) => {
    try {
       
            const perPage = 10; 
            const page = parseInt(req.query.page) || 1; 

            
            const productData = await productCollection.find({})
                .populate('offers')
                .populate('category')
                .sort({ _id: -1 })
                .skip((perPage * page) - perPage)
                .limit(perPage);

                
            const count = await productCollection.countDocuments();

            res.render('admin-productManage', {
                product: productData,
                isSuperAdmin: req.session.isSuperAdmin,
                currentPage: page,
                totalPages: Math.ceil(count / perPage)
            });
       
    } catch (error) {
        console.error('Error in admin_productManage:', error);
        res.redirect('/admin/errorPage');
    }
};



const admin_productStatus = async(req,res)=>{
    try {
            const productId = req.params.id
            const productStatus = req.query.status
        
            
                let productData;
                if(productStatus=="true"){
                    productData = await productCollection.updateOne({_id:new ObjectId(productId)},{$set:{status:false}})
                }else{
                    productData = await productCollection.updateOne({_id:new ObjectId(productId)},{$set:{status:true}})
                }
                res.redirect('/admin/admin-productManage')
  
    } catch (error) {
        console.error('Error in admin_productStatus:', error);
        res.redirect('/admin/errorPage')
    }
    
    }









module.exports = {
    admin_productManage,
    admin_productStatus

}