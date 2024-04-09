




const Admin_dashbord = async(req,res)=>{
    if(req.session.isAdminAuth){
        res.render('admin-dashbord',{userName:'Justin Ram'})
    }else{
        res.redirect('/admin/admin-login')
    }
    
}

module.exports = {Admin_dashbord}