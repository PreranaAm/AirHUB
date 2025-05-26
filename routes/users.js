const express = require("express")
const router = express.Router()
const wrapasync = require("../utils/wrapasync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listschema, reviewschema } = require("../schema.js")
const list=require("../models/listing.js")
const {isloggedin}=require("../middleware.js")
const usercontroller=require("../controllers/users.js")
const multer  = require('multer')
const {cloudinary,storage}=require("../cloudinary.js")
const upload = multer({storage})
const validateschema = (req, res, next) => {
  let { error } = listschema.validate(req.body)
  if (error) {
    throw new ExpressError(404, error)
  }
  else {
    next()
  }
}
router.get("/", wrapasync(async (req, res) => {
  let r = await list.find({})
 
  res.render("home.ejs", { r })
}))
router.get("/show/:id", wrapasync(async (req, res) => {
  let { id } = req.params
  let re = await list.findOne({ _id: id }).populate({ path: "review", populate: { path: "author" } })
    .populate("owner")
    console.log(re.review)
  if(!re){
    req.flash("error","Listings not found")
    return res.redirect("/users")
  }
  
  res.render("show.ejs", { re })
}))
router.get("/new", (req, res) => {
  res.render("new.ejs")
})

router.post("/new",isloggedin,upload.single('listing[image]'), 
validateschema, wrapasync(async (req, res, next) => {
  let url=req.file.path
  let filename=req.file.filename;
  let newlist = new list(req.body.listing)
  newlist.image={filename:filename,url:url};
  newlist.owner=req.user._id
  await newlist.save()
  
  req.flash('registor', 'New user registered')
  res.redirect("/users")
}))
// router.post("/new", , (req, res, next) =>{
//   console.log("rk")
// res.send(req.file)
// })
module.exports = router;