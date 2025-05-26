const list=require("./models/listing.js")
const review=require("./models/reviews.js")
module.exports.isloggedin=(req,res,next)=>{
    
    if(!req.isAuthenticated())
    {
        req.session.redirecturl=req.originalUrl.split('?')[0]
        req.flash("error","not logged in")
        return res.redirect('/login')
    }
    next()
}
module.exports.savedirect=(req,res,next)=>{
    if(req.session.redirecturl)
    {
        res.locals.redirect=req.session.redirecturl
    }
    next()
}
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params
    let list1 =await list.findOne({_id:id})
    if(!list1.owner._id.equals(res.locals.current._id))
    {
        req.flash("error","permission denied")
        return res.redirect(`/users/show/${id}`)
    }
    next()
}
module.exports.isAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params
    let list1 =await review.findOne({_id:reviewId})
    if(!list1.author.equals(res.locals.current._id))
    {
        req.flash("error","permission denied")
        return res.redirect(`/users/show/${id}`)
    }
    next()
}