const express = require("express")
const router = express.Router({mergeParams:true})
const wrapasync = require("../utils/wrapasync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listschema, reviewschema } = require("../schema.js")
const review=require("../models/reviews.js")
const {isloggedin,savedirect,isOwner,isAuthor}=require("../middleware.js")
const list=require("../models/listing.js")
const validateschema2=(req,res,next)=>{
  console.log("Review body:", req.body);

  let {error}=reviewschema.validate(req.body)
  if(error){
    throw new ExpressError(404,error)
  }
  else{
    next()
  }
  }
router.delete("/:reviewId",isloggedin,isAuthor,wrapasync(async(req,res)=>{
    let {id,reviewId}=req.params
    await list.findOneAndUpdate({_id:id},{$pull:{review:reviewId}})
    await review.findOneAndDelete({_id:id})
    res.redirect("/users")
  }))

  router.post("/",validateschema2,wrapasync(async(req,res)=>{
  
    let {id}=req.params;
    console.log(req.body)
    let r=await list.findOne({_id:id}) 
    
    let newreview=new review(req.body.review)
    newreview.author=req.user._id
   await newreview.save()
    r.review.push(newreview)
    await r.save()
    res.redirect("/users")
  }))
  module.exports=router