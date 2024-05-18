const express = require("express");
const routerDoc = express.Router();
const {doctorInfo,updateDoctorInfo,doctorInfoId}=require('../Controller/doctorController');
const authMiddleware = require("../Middlewares/authMiddleware");
routerDoc.get("/getdocterinfo",authMiddleware,doctorInfo)
routerDoc.post("/updatedoctorinfo",authMiddleware,updateDoctorInfo)
routerDoc.post("/getdocterinfoid",doctorInfoId)
module.exports=routerDoc;