const mongoose = require('mongoose');
const User=require("./users.js")
const {Schema}=mongoose;

const reviewschema=new mongoose.Schema({
    comment:String,
    rating:{type:Number,min:1,max:5},
    createdat:{type:Date,default:Date()},
    author:{type:Schema.Types.ObjectId,ref:"User"}

})
const review=mongoose.model("review",reviewschema)
module.exports=review;