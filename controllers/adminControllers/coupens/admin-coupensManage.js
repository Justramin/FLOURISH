


const admin_coupensManage = async(req,res)=>{
    if(req.session.isAdminAuth){
        res.render('admin-coupensManage')
    }else{
        res.redirect('/admin/admin-login')
    }
}

module.exports = {admin_coupensManage}