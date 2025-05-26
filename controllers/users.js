const User = require('../models/users.js');
module.exports.sinupget=(req,res)=>{
    res.render("signup.ejs")
}
module.exports.signuppost=async(req,res)=>{
    let {username,email,password}=req.body
    let user1=new User({username:username,email:email})
   let registereduser= await User.register(user1,password)
   req.login(registereduser,(err)=>{
    if(err){
        return next(err)
    }
    req.flash("registor","User registered")
    res.redirect("/users")
   })
    
}
module.exports.loginget=(req,res)=>{
    
    res.render("login.ejs")
}
module.exports.loginpost= (req,res)=>{
          
        let redirect=res.locals.redirect||'/users'
        console.log(redirect)
    req.flash("registor","Login successful")
    res.redirect(redirect)
}
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err)
        {
            return next(err)
        }
         req.flash("registor","logged out ")
    res.redirect("/users")
    })
   
}