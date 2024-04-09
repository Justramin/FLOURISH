const adminCollection = require("../../../model/adminSchema")
const collection = require("../../../model/userSchema")


const admin_login = async(req,res)=>{
    if(req.session.isAdminAuth){
        res.redirect('/admin/admin_dashbord')
    }else{
        res.render('admin-login')
    }
    
    
}



const admin_login_post = async(req,res)=>{
    const adminData= req.body
     const findData =await adminCollection.findOne({email:adminData.email})
    if(!findData || findData.password !== adminData.password || !findData.status){
        console.log("wrong somthing");
        res.redirect('/admin')
    }else {
        console.log("correct somthing");
        req.session.isAdminAuth = true
        req.session.adminEmail = req.body.email
        res.redirect('/admin/admin_dashbord')
    }

}


const admin_logout = async(req,res)=>{
    req.session.isAdminAuth = false
    res.redirect('/admin/admin-login')
}




module.exports = {admin_login , admin_login_post , admin_logout}