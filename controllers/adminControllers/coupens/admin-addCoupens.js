


const admin_addCoupens = async(req,res)=>{
    if(req.session.isAdminAuth){
        res.render('admin-addCoupens')
    }else{
        res.redirect('/admin/admin-login')
    }
}

module.exports = {admin_addCoupens}