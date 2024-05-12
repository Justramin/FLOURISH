const express = require('express')
const router = express.Router()
const isUser = require('../../utils/isUserMiddleware')

const userError = require('../../controllers/userControllers/404Error/404Error')
const signup=require('../../controllers/userControllers/auth/signup')
const signupOtp = require('../../controllers/userControllers/auth/signup-otp')
const login = require('../../controllers/userControllers/auth/login')
const home = require('../../controllers/userControllers/home/home')
const product = require('../../controllers/userControllers/product/product')
const productDetail = require('../../controllers/userControllers/product/productDetail')
const dealOfTheMonth = require('../../controllers/userControllers/dealOf/dealOfTheMonth')
const profilePage = require('../../controllers/userControllers/userAccount/profilePage')
const adress = require('../../controllers/userControllers/userAccount/adress')
const addAdress = require('../../controllers/userControllers/userAccount/addAdress')
const editAddress = require('../../controllers/userControllers/userAccount/editeAdress')
const resetPassword = require('../../controllers/userControllers/userAccount/resetPassword')
const userProfile = require('../../controllers/userControllers/userAccount/userProfile')
const userWhishlist =require('../../controllers/userControllers/userWhishlist/userWhishlist')
const userCart = require('../../controllers/userControllers/userCart/userCart')
const checkOut = require('../../controllers/userControllers/checkOut/checkOut')




//Gust
router.get('/signup',signup.user_signup)
router.post('/signup',signup.user_signupPost)
router.get('/signupOtp',signupOtp.signupOtpGet)
router.post('/signupOtp',signupOtp.signupWithOtp)

router.get('/resetOtp',signupOtp.resendOtp)

router.get('/login',login.user_login)
router.post('/user_loginPost',login.user_loginPost)
router.get('/logout',login.user_logOut)



router.get('/',home.home)

router.get('/dealOfTheMonth',dealOfTheMonth.dealOfTheMonth)
router.get('/product',product.product)
router.get('/productDetail',productDetail.productDetail)

router.get('/userError',userError.userError)



//Users Only

//User Account
router.get('/profilePage',isUser.isUser,profilePage.profilePage)
router.get('/address',isUser.isUser,adress.address)
router.get('/addAddress',isUser.isUser,addAdress.addAddress)
router.post('/addAddresspost',isUser.isUser,addAdress.addAddresspost)
router.get('/editAddress/:id',isUser.isUser,editAddress.editeAddress)
router.post('/editeAddressPost',isUser.isUser,editAddress.editeAddressPost)
router.get('/deleteAddress/:id',isUser.isUser,editAddress.deleteAddress)
router.get('/resetPassword',isUser.isUser,resetPassword.resetPassword)
router.post('/resetPasswordPost',isUser.isUser,resetPassword.resetPasswordPost)
router.get('/userProfile',isUser.isUser,userProfile.userProfile)
router.post('/userProfilePost',isUser.isUser,userProfile.userProfilePost)



//Whishlist
router.get('/userWhishlist',isUser.isUser,userWhishlist.userWhishlist)
router.post('/addWhishlist',userWhishlist.addWhishlist)


//Cart
router.get('/userCart',isUser.isUser,userCart.userCart)
router.post('/addToCart',userCart.addToCart)
router.post('/updateCartQuantity/:productId/',isUser.isUser,userCart.updateQuantity)
router.get('/removeToCart/:id',isUser.isUser,userCart.removeToCart)


//CheckOut
router.get('/checkOut',isUser.isUser,checkOut.checkOut)



module.exports = router

