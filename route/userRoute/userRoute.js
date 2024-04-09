const express = require('express')
const router = express.Router()
const signup=require('../../controllers/userControllers/auth/signup')
const signupOtp = require('../../controllers/userControllers/auth/signup-otp')
const login = require('../../controllers/userControllers/auth/login')
const home = require('../../controllers/userControllers/home/home')
const product = require('../../controllers/userControllers/product/product')


router.get('/signup',signup.user_signup)
router.post('/signup',signup.user_signupPost)

router.get('/signupOtp',signupOtp.signupOtpGet)
router.post('/signupOtp',signupOtp.signupOtp)


router.get('/login',login.user_login)



router.get('/',home.home)
router.get('/home',home.home)

router.get('/product',product.product)

router.get('/resetPassword',signupOtp.resendOtp)


module.exports = router

