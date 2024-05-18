const express = require("express");
const routerAdmin = express.Router();
const {getUsersList,getDoctorsList, ChangeDoctorsList}=require('../Controller/adminController');
const authMiddleware = require("../Middlewares/authMiddleware");
routerAdmin.get("/getuserlist",authMiddleware,getUsersList);
routerAdmin.get("/getdoctorslist",authMiddleware,getDoctorsList)
routerAdmin.post("/ChangeStatus",authMiddleware,ChangeDoctorsList)

module.exports=routerAdmin;