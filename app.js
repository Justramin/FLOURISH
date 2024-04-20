const express = require('express')
const app = express()
const path = require('path')
// const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const userRouter = require('./route/userRoute/userRoute')
const adminRouter = require('./route/adminRoute/adminRoute')
const connectDB = require('./config/db')


connectDB();
const port = 4000


app.set('views', [
    path.join(__dirname,'views/user/user-auth')
 ,path.join(__dirname,'views/user/user-home')
 ,path.join(__dirname,'views/user/user-product')
 ,path.join(__dirname,'views/user/dealOf')
 , path.join( __dirname,'views/admin/admin-auth')
 , path.join( __dirname,'views/admin/partials')
 , path.join(__dirname,'views/admin/admin-dashbord')
 ,path.join(__dirname,'views/admin/admin-userManage')
 ,path.join(__dirname,'views/admin/admin-productManage')
 ,path.join(__dirname,'views/admin/admin-coupens')
 ,path.join(__dirname,'views/admin/admin-categoryList')
 ,path.join(__dirname,'views/admin/admin-banner')
 ,path.join(__dirname,'views/admin/admin-orders')
 ,path.join(__dirname,'views/admin/admin-adminManage')
])

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}))

app.use(flash())


app.listen(port,()=>{
    console.log('server running');
})



app.use('/', userRouter)
app.use('/admin',adminRouter)
