const categoryCollection = require("../../../model/categorySchema")
const { ObjectId } = require('mongodb');




const admin_categoryList = async(req,res)=>{
    if(req.session.isAdminAuth){
        const category = await categoryCollection.find()
        res.render('admin-categoryList',{category:category})
    }else{
        res.redirect('/admin/admin-login')
    }
    
}

const admin_categoryStatus = async(req,res)=>{
    const categoryId = req.params.id
    const categoryStatus = req.query.status

    if(req.session.isAdminAuth){
        let category;
        if(categoryStatus=="true"){
            category = await categoryCollection.updateOne({_id:new ObjectId(categoryId)},{$set:{status:false}})
        }else{
            category = await categoryCollection.updateOne({_id:new ObjectId(categoryId)},{$set:{status:true}})
        }
        res.redirect('/admin/admin_categoryList')
    }else{
        res.redirect('/admin/admin-login')
    }
    
}


module.exports = {
    admin_categoryList,
    admin_categoryStatus
}