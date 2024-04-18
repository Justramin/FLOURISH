




const Admin_dashbord = async(req,res)=>{
    try {
        if(req.session.isAdminAuth){
            res.render('admin-dashbord',{userName:'Justin Ram'})
        }else{
            res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.error('Error in Admin_dashbord:', error);
        res.status(500).send('Internal Error');
    }  
}



module.exports = {
    Admin_dashbord
}