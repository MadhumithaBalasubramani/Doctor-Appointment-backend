const express = require("express");
const routerReg = express.Router();
const {
  userRegPost,
  login,
  getUserInfo,
  doctorApplication,
  markNotifAsSeen,
  deleteSeenNotifications,
  getApprovedDoctorsList,
  bookAppointment,
  checkAvailability,
  getAppointmentsList
} = require("../Controller/userController");
const authMiddleware = require("../Middlewares/authMiddleware");
routerReg.post("/userregister", userRegPost);
routerReg.post("/userlogin", login);
routerReg.post("/getuserinfo", authMiddleware, getUserInfo);
routerReg.post("/applydoctoraccount", authMiddleware, doctorApplication);
routerReg.post("/markseen", authMiddleware, markNotifAsSeen);
routerReg.post("/deleteallnotifications",deleteSeenNotifications );
routerReg.get("/getApprovedDoctorsList",authMiddleware,getApprovedDoctorsList)
routerReg.post("/bookappointment",authMiddleware,bookAppointment)
routerReg.post("/checkbookAvailability",authMiddleware,checkAvailability)
routerReg.get("/getappointmentslistid",authMiddleware,getAppointmentsList)
module.exports = routerReg;
