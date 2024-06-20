




const Admin_dashbord = async(req,res)=>{
    try {
       
            res.render('admin-dashbord',{userName:'Justin Ram',isSuperAdmin:req.session.isSuperAdmin})
       
    } catch (error) {
        console.error('Error in Admin_dashbord:', error);
        res.redirect('/admin/errorPage')
    }  
}



module.exports = {
    Admin_dashbord
}