// getting-started.js
const express=require("express")
const app=express()

if(process.env.NODE_ENV!="Production"){
require('dotenv').config()
}

console.log(process.env.SECRET_KEY)
const multer  = require('multer')
const {cloudinary,storage}=require("./cloudinary.js")
const upload = multer({storage})
const path=require("path")
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
const list=require("./models/listing.js")
const review=require("./models/reviews.js")
app.use(express.static(path.join(__dirname,"/public")))
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

app.use(express.json())
app.use(express.urlencoded({extended:true}))
var methodOverride = require('method-override')
app.use(methodOverride('_method'))
engine = require('ejs-mate')

 const dbrul=process.env.URL;
const wrapasync=require("./utils/wrapasync.js")
const ExpressError = require("./utils/ExpressError.js")
const {listschema,reviewschema}=require("./schema.js")
app.engine('ejs', engine);
const users=require("./routes/users.js")
const reviews=require("./routes/reviews.js")
const register=require("./routes/register.js")
var session = require('express-session')
const User = require('./models/users.js');
const passport=require("passport")
const LocalStrategy=require("passport-local")
const {isloggedin,savedirect,isOwner}=require("./middleware.js")
main().catch(err => console.log(err));
const store=MongoStore.create({
  mongoUrl: dbrul,
  crypto:{
     secret: process.env.SECRET_KEY
  },
  touchAfter:24*3600
})
store.on("error",()=>{
  console.log("error")
})
app.use(session({
 store,
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {expires:Date.now()*7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
}))

passport.use(new LocalStrategy(User.authenticate()));
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var flash = require('connect-flash');
app.use(flash());


async function main() {
//  await mongoose.connect('mongodb://127.0.0.1:27017/kr');
await mongoose.connect(dbrul);
}
app.use((req,res,next)=>{
  res.locals.registor=req.flash("registor")
  res.locals.error=req.flash("error")
  res.locals.current=req.user;
  next()
})
// app.post("/users/new",(req,res,next)=>{
//   let {title,description,price,location,country}=req.body
//   list.insertMany([{title:title,description:description,price:price,
//     location:location,country:country}]).then((re)=>{
//       res.redirect("/users")
//      })
//      .catch((err)=>{
//     next(err)
//      })
// })
//or wrap it under wrapasync

app.use("/users",users)
app.use("/listings/:id/review",reviews)
app.use("/",register)
app.get("/edit/:id",wrapasync(async(req,res)=>{
 
  let {id}=req.params
  let re=await list.findOne({_id:id})
  let originalurl=re.image.url
  console.log(originalurl)
  originalurl = originalurl.replace("/upload", "/upload/h_250,w_250,");
  res.render("edit.ejs",{re,originalurl})
   }))
  

app.patch("/edit/:id",isloggedin,upload.single('listing[image]'),isOwner,wrapasync(async(req,res)=>{
  
  let {id}=req.params
  // let {title,description,price,location,country}=req.body
  let list1=await list.findOneAndUpdate({_id:id},{...req.body.listing})
  if(typeof req.file!="undefined")
  {
     let url=req.file.path;
     let filename=req.file.filename
     list1.image={url:url,filename:filename}
  }
  await list1.save()
  req.flash("registor","updated the users")
  if(!list){
    req.flash("error","Listings not found")
   return  res.redirect("/users")
  }
  res.redirect("/users")
}))


app.delete("/delete/:id/d",isloggedin,wrapasync(async(req,res)=>{
console.log(req)
  let {id}=req.params
  await list.findByIdAndDelete({_id:id})
  req.flash("registor","Deleted the users")
  res.redirect("/users")
}))

app.all('/{*any}', (req, res, next)   => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err,req,res,next)=>{
  let {status=500,message="not  error "}=err
  res.status(status).render("error.ejs",{err})
 
})

app.listen(8080,()=>{
    console.log("conncet")
})