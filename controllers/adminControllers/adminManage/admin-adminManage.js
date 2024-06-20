const admincollection = require("../../../model/adminSchema")
const { ObjectId } = require('mongodb')



const admin_adminManage = async (req, res) => {
    try {
        
            const perPage = 10; 
            const page = parseInt(req.query.page) || 1; 

            // Fetch admin data with pagination
            const adminData = await admincollection.find({ superAdmin: false })
                .sort({ _id: -1 })
                .skip((perPage * page) - perPage)
                .limit(perPage);

            
            const count = await admincollection.countDocuments({ superAdmin: false });

            res.render('admin-adminManage', {
                admin: adminData,
                currentPage: page,
                totalPages: Math.ceil(count / perPage)
            });
    
    } catch (error) {
        console.error('Error in admin_adminManage:', error);
        res.redirect('/admin/errorPage');
    }
};





const admin_adminStatus = async(req,res)=>{
    try {
        const adminId = req.params.id
        const adminStatus = req.query.status

      
            let adminData;
            if(adminStatus=="true"){
            adminData = await admincollection.updateOne({_id:new ObjectId(adminId)},{$set:{status:false}})
            }else{
            adminData = await admincollection.updateOne({_id:new ObjectId(adminId)},{$set:{status:true}})
            }
            res.redirect('/admin/admin_adminMnage')
    } catch (error) {
        console.error('Error in admin_adminStatus:', error);
        res.redirect('/admin/errorPage')
    }  
}


module.exports = {
    admin_adminManage,
    admin_adminStatus
}