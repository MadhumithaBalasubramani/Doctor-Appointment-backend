const mongoose=require('mongoose');
const connect=()=>{
    mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("mongodb connected")
})
.catch((err)=>{
    console.log("mongodb not connected",err.message);
});
};

module.exports=connect;