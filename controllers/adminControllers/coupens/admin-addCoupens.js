


const admin_addCoupens = async(req,res)=>{
    try {
        if(req.session.isAdminAuth){
            res.render('admin-addCoupens',{isSuperAdmin:req.session.isSuperAdmin})
        }else{
            res.redirect('/admin/admin-login')
        } 
    } catch (error) {
        console.error('Error in admin_addCoupens:', error);
        res.redirect('/admin/errorPage')
    }
}




const adminAddCoupensPost = async(req,res)=>{
    try {
        if(req.session.isAdminAuth){
            const body = req.body
            console.log(body);

        }else{
            res.redirect('/admin/admin-login')
        } 
    } catch (error) {
        console.error('Error in adminAddCoupensPost:', error);
        res.redirect('/admin/errorPage')
    }
}


module.exports = {
    admin_addCoupens,
    adminAddCoupensPost
}