



const admin_orders = async (req,res)=>{
    try {
        if(req.session.isAdminAuth){
            res.render('admin-orders',{isSuperAdmin:req.session.isSuperAdmin})
        }else{
            res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.error('Error in admin_orders:', error);
        res.redirect('/admin/errorPage')
    }
}




module.exports ={
    admin_orders
}