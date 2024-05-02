const express = require('express')
const router = express.Router()
const isUser = require('../../utils/isUserMiddleware')


const signup=require('../../controllers/userControllers/auth/signup')
const signupOtp = require('../../controllers/userControllers/auth/signup-otp')
const login = require('../../controllers/userControllers/auth/login')
const home = require('../../controllers/userControllers/home/home')
const product = require('../../controllers/userControllers/product/product')
const productDetail = require('../../controllers/userControllers/product/productDetail')
const dealOfTheMonth = require('../../controllers/userControllers/dealOf/dealOfTheMonth')
const profilePage = require('../../controllers/userControllers/userAccount/profilePage')



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




//Users Only
router.get('/profilePage',isUser.isUser,profilePage.profilePage)







module.exports = router

