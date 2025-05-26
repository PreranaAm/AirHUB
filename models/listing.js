const mongoose = require('mongoose');
const review=require("./reviews.js")
const User=require("./users.js")
const {Schema}=mongoose;

const listschema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,

    },
    image:{
      filename:String,
      url:String,
        // default:"https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        // set: (v) =>
        //     v === ""
        //       ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
        //       : v,

    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    review:[{type:Schema.Types.ObjectId,ref:"review"}],
    owner:{type:Schema.Types.ObjectId,ref:"User"}
    
})
listschema.post("findOneAndDelete",async(list)=>{
  
    if(list){
        console.log(list)
    await review.deleteMany({_id:{$in:list.review}})
}
})
listschema.post("findByIdAndDelete", async (list) => {
    if (list) {
      console.log("Deleting reviews (by ID):", list.review);
      await review.deleteMany({ _id: { $in: list.review } });
    }
  });
const list=mongoose.model("list",listschema)
module.exports=list;