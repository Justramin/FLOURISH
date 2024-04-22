


const admin_coupensManage = async(req,res)=>{
    try {
        if(req.session.isAdminAuth){
            res.render('admin-coupensManage',{isSuperAdmin:req.session.isSuperAdmin})
        }else{
            res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.error('Error in admin_coupensManage:', error);
        res.status(500).send('Internal Error');
    }
}




module.exports = {
    admin_coupensManage
}