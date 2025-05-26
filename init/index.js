const mongoose = require('mongoose');
const somedata=require('./data.js')
const list=require('../models/listing.js')
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/kr');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
let inidb=async ()=>{
await list.deleteMany({})
somedata.data=somedata.data.map((obj)=>({
 ...obj,owner:"68203e930f03eba192fab930"})
)
await list.insertMany(somedata.data)
console.log("done inserted")
}
inidb()