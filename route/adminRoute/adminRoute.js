


const express = require('express')
const router = express.Router()
const signin = require('../../controllers/adminControllers/auth/admin-auth')
const Admin_dashbord = require('../../controllers/adminControllers/dashbord/admin-dashbord')
const admin_userManage = require('../../controllers/adminControllers/userManagement/admin-userMange')
const admin_productManage = require('../../controllers/adminControllers/productManage/admin-productManage')
const admin_addProduct = require('../../controllers/adminControllers/productManage/admin-addProduct')
const admin_editProduct = require('../../controllers/adminControllers/productManage/admin-editProduct')
const admin_coupensManage = require('../../controllers/adminControllers/coupens/admin-coupensManage')
const admin_addCoupens = require('../../controllers/adminControllers/coupens/admin-addCoupens')
const admin_categoryList = require('../../controllers/adminControllers/categoryList/admin-categoryList')
const admin_addCategory = require('../../controllers/adminControllers/categoryList/admin-addCategory')
const admin_editCategory = require('../../controllers/adminControllers/categoryList/admin-editCategory')
const admin_banner = require('../../controllers/adminControllers/banner/admin-banner')
const admin_addBanner = require('../../controllers/adminControllers/banner/admin-addBanner')
const admin_orders = require('../../controllers/adminControllers/orders/admin-orders')
const admin_adminMnage = require('../../controllers/adminControllers/adminManage/admin-adminManage')
const admin_addAdmin = require('../../controllers/adminControllers/adminManage/admin-addAdmin')
const upload = require('../../config/multer')


router.get('/',signin.admin_login)
router.get('/admin-login',signin.admin_login)
router.post('/admin_dashbord',signin.admin_login_post)
router.get('/admin_dashbord',Admin_dashbord.Admin_dashbord)
router.get('/admin-logout',signin.admin_logout)
router.get('/admin-userManage',admin_userManage.admin_userManage)
router.get('/admin-productManage',admin_productManage.admin_productManage)
router.get('/admin_addProduct',admin_addProduct.admin_addProduct)
router.get('/admin_editProduct/:id',admin_editProduct.admin_editProduct)

router.post('/admin_editProduct/:id',upload.array('image',10),admin_editProduct.admin_editProductPut)
router.get('/productImageDelete/:id',admin_editProduct.productImageDelete)
router.get('/admin_coupensManage',admin_coupensManage.admin_coupensManage)
router.get('/admin_addCoupens',admin_addCoupens.admin_addCoupens)
router.get('/admin_categoryList',admin_categoryList.admin_categoryList)
router.get('/admin_addCategory',admin_addCategory.admin_addCategory)

router.get('/admin_editCategory/:id',admin_editCategory.admin_editCategory)
router.post('/admin_editCategory/:id',admin_editCategory.admin_editCategoryPost)

router.get('/admin_banner',admin_banner.admin_banner)
router.get('/admin_addBanner',admin_addBanner.admin_addBanner)
router.get('/admin_orders',admin_orders.admin_orders)
router.get('/admin_adminMnage',admin_adminMnage.admin_adminManage)
router.get('/admin_addAdmin',admin_addAdmin.admin_addAdmin)
router.post('/admin_addAdmin',admin_addAdmin.newAdmin)

router.get('/userStatus/:id',admin_userManage.admin_userStatus)
router.post('/admin_addCategory',admin_addCategory.admin_addCategoryPost)

router.get('/categoryStatus/:id',admin_categoryList.admin_categoryStatus)

router.get('/adminStatus/:id',admin_adminMnage.admin_adminStatus)

router.post('/admin_addProduct',upload.array('image',5), admin_addProduct.admin_addProductPost)

router.get('/productStatus/:id',admin_productManage.admin_productStatus)





module.exports = router


