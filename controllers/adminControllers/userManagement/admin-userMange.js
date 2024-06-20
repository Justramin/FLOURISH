const collection = require("../../../model/userSchema")
const { ObjectId } = require('mongodb')


const admin_userManage = async (req, res) => {
    try {
       
            const perPage = 10; // Number of users per page
            const page = req.query.page || 1; // Current page, default to 1 if not provided

            // Fetch the user data with pagination
            const userData = await collection.find()
                .sort({ _id: -1 })
                .skip((perPage * page) - perPage)
                .limit(perPage);

            // Get total count of users for pagination
            const count = await collection.countDocuments();

            res.render('admin-userManage', {
                users: userData,
                isSuperAdmin: req.session.isSuperAdmin,
                currentPage: page,
                totalPages: Math.ceil(count / perPage)
            });
       
    } catch (error) {
        console.error('Error in admin_userManage:', error);
        res.redirect('/admin/errorPage');
    }
};





const admin_userStatus = async(req,res)=>{
    try {
        const userId = req.params.id
        const userStatus = req.query.status
   
        let userData;
        if(userStatus=="true"){
             userData = await collection.updateOne({_id:new ObjectId(userId)},{$set:{status:false}})
        }else{
             userData = await collection.updateOne({_id:new ObjectId(userId)},{$set:{status:true}})
        }
        res.redirect('/admin/admin-userManage')
   
    } catch (error) {
        console.error('Error in admin_userStatus:', error);
        res.redirect('/admin/errorPage')
    }  
}




module.exports = {
    admin_userManage,
    admin_userStatus
}