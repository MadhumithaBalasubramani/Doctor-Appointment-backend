const mongoose=require('mongoose')
const { doctorInfo } = require('../Controller/doctorController')
const appointmentShemema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    doctorId:{
        type:String,
        required:true
    },
    doctorInfo:{
        type:Object,
        required:true
    },
    userInfo:{
        type:Object,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    time:{
        type:Array,
        required:true,

    },
    status:{
        type:String,
        required:true,
        status:'pending'
    },
},{
    timestamps:true,
})
const appointmentModel=mongoose.model("appointment",appointmentShemema)
module.exports=appointmentModel;