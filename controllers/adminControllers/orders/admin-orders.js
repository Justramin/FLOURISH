const orderCollection = require("../../../model/orderSchema");




const admin_orders = async (req,res)=>{
    try {
        if(req.session.isAdminAuth){
            const data = await orderCollection.find({}).sort({_id:-1});
            console.log(data)
            res.render('admin-orders',{isSuperAdmin:req.session.isSuperAdmin,data:data})
        }else{
            res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.error('Error in admin_orders:', error);
        res.redirect('/admin/errorPage')
    }
}

const adminOrderDetail = async (req,res)=>{
    try {
        if(req.session.isAdminAuth){
            const data = await orderCollection.findOne({orderID:req.params.id});
            console.log(data)
            res.render('admin-orderDetail',{isSuperAdmin:req.session.isSuperAdmin,data:data})
        }else{
            res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.error('Error in admin_orders:', error);
        res.redirect('/admin/errorPage')
    }
}

const updateStatus = async (req,res)=>{
    try {
        if(req.session.isAdminAuth){
            console.log(req.body)
            const orderData = await orderCollection.updateOne({ orderID: req.query.id }, 
                {
                $set: {
                    [`products.${req.query.index}.status`]: `${req.body.status}` 
                }
            });
            res.redirect(`/admin/adminOrderDetail/${req.query.id}`);
        }else{
            res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.error('Error in admin_orders:', error);
        res.redirect('/admin/errorPage')
    }
}




module.exports ={
    admin_orders,
    adminOrderDetail,
    updateStatus,
}