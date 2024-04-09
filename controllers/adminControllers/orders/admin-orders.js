



const admin_orders = async (req,res)=>{
    if(req.session.isAdminAuth){
        res.render('admin-orders')
    }else{
        res.redirect('/admin/admin-login')
    }
}
module.exports = {admin_orders}