const express = require("express")
const wrapasync = require("../utils/wrapasync")
const router = express.Router()
const passport=require("passport")
const User = require('../models/users.js');
const {isloggedin,savedirect}=require("../middleware.js")
const usercontroller=require("../controllers/users.js")
router.route("/signup")
 .get(usercontroller.sinupget)
 .post(wrapasync(usercontroller.signuppost))
 router.route("/login")
  .get(usercontroller.loginget)
  .post(savedirect,passport.authenticate('local', { failureRedirect: '/login' ,failureFlash:true}),usercontroller.loginpost)
router.get("/logout",usercontroller.logout);
module.exports=router