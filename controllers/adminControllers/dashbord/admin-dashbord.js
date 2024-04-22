




const Admin_dashbord = async(req,res)=>{
    try {
        if(req.session.isAdminAuth){
            res.render('admin-dashbord',{userName:'Justin Ram',isSuperAdmin:req.session.isSuperAdmin})
        }else{
            res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.error('Error in Admin_dashbord:', error);
        res.redirect('/admin/errorPage')
    }  
}



module.exports = {
    Admin_dashbord
}