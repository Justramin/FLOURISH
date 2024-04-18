



const admin_orders = async (req,res)=>{
    try {
        if(req.session.isAdminAuth){
            res.render('admin-orders')
        }else{
            res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.error('Error in admin_orders:', error);
        res.status(500).send('Internal Error');
    }
}




module.exports ={
    admin_orders
}