const categoryCollection = require("../../../model/categorySchema")
const { ObjectId } = require('mongodb');




const admin_categoryList = async (req, res) => {
    try {
      
            const perPage = 10; 
            const page = parseInt(req.query.page) || 1; 

           
            const categories = await categoryCollection.find({})
                .sort({ _id: -1 })
                .skip((perPage * page) - perPage)
                .limit(perPage);

            
            const count = await categoryCollection.countDocuments();

            res.render('admin-categoryList', {
                category: categories,
                isSuperAdmin: req.session.isSuperAdmin,
                currentPage: page,
                totalPages: Math.ceil(count / perPage)
            });
    } catch (error) {
        console.error('Error in admin_categoryList:', error);
        res.redirect('/admin/errorPage');
    }
};






const admin_categoryStatus = async(req,res)=>{
    try {
        const categoryId = req.params.id
        const categoryStatus = req.query.status
       
            let category;
        if(categoryStatus=="true"){
            category = await categoryCollection.updateOne({_id:new ObjectId(categoryId)},{$set:{status:false}})
        }else{
            category = await categoryCollection.updateOne({_id:new ObjectId(categoryId)},{$set:{status:true}})
        }
        res.redirect('/admin/admin_categoryList')
   
    } catch (error) {
        console.error('Error in admin_categoryStatus:', error);
        res.redirect('/admin/errorPage')
    }
}





module.exports = {
    admin_categoryList,
    admin_categoryStatus
}