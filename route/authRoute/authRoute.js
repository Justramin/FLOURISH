const express = require('express')
const router = express.Router()
const flash = require('express-flash')





require('../../utils/auth')
const passport = require('passport')
const collection = require('../../model/userSchema')



//GOOGLE AUTHENTCATION
router.get('/auth/google',
passport.authenticate('google', { scope: ['email','profile'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  async function(req, res) {
    const user = req.user
   
    const userData = {
        name: user.displayName,
        email: user.emails[0].value
      }

      const alreadyLoginUserData = await collection.findOne({email:userData.email})
      try {
        if(alreadyLoginUserData && alreadyLoginUserData.length > 0){
          req.session.isUser=alreadyLoginUserData
            res.redirect('/');
        }else{
            const createdUser = await collection.create(userData);
            req.session.isUser=createdUser            
            res.redirect('/');
        }
        
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
  });


  



module.exports = router


