const mongoose = require("mongoose");
const userModel = require("../Model/userModel");
const Doctor = require("../Model/doctorModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Appointment = require("../Model/AppointmentModel");
const moment=require("moment");
const appointmentModel = require("../Model/AppointmentModel");
const userRegPost = async (req, res) => {
  try {
    console.log("test");
    const { name, email, password } = req.body;
    const userExist = await userModel.findOne({ email });
    console.log(userExist);
    if (userExist) {
      return res.send({ message: "user already exist", success: false });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newuser = new userModel({
      name,
      email,
      password: hashPassword,
    });
    await newuser.save();
    // Send success response
    return res.status(201).json({
      data: newuser,
      message: "User created successfully.",
      success: true,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in user registration:", error);

    // Send error response
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
      error: error.message, // Send error message in the response for debugging
    });
  }
};
const login = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user doesn't exist", success: false });
    }
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordMatch) {
      return res
        .status(200)
        .send({ message: `Password doesn't match`, success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        //here user id is encrypted
        expiresIn: "30min",
      });
      return res
        .status(200)
        .send({ message: "login successfull", success: true, data: token });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Failed to login ", success: false, error });
  }
};
const getUserInfo = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ message: "user doesn't exist ", success: false });
    } else {
      return res.status(200).send({ success: true, data: user });
    }
  } catch (error) {
    res
      .status(401)
      .send({ message: "failed to get user info", success: false, error });
  }
};
const doctorApplication = async (req, res) => {
  try {
    const newDoctor = new Doctor({ ...req.body, status: "Pending" });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const unseenNotification = adminUser.unseenNotification;
    unseenNotification.push({
      type: "new-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
      },
      onClickPath: "/doctors",
    });
    await userModel.findByIdAndUpdate(adminUser._id, {
      $push: { unseenNotification },
    });
    res.status(200).send({
      message: "doctor application Applied Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Failed to post - apply dotor", success: false, error });
  }
};
const markNotifAsSeen = async (req, res) => {
  try {
    const userData = await userModel.findOne({ _id: req.body.userId });
    const unseenNotification = userData.unseenNotification;
    const seenNotifications = userData.seenNotifications;
    userData.seenNotifications.push(...unseenNotification);
    userData.unseenNotification = [];
    userData.seenNotifications = seenNotifications;
    // const updatedUser=await userModel.findByIdAndUpdate(user._id);
    // updatedUser.password=undefined;
    const response = await userData.save();
    response.password = undefined;

    res.status(200).send({
      message: "Notifications are marked as Seen ",
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(500).send({
      message: "Failed to mark notification as seen",
      success: false,
      error,
    });
  }
};

const deleteSeenNotifications = async (req, res) => {
  try {
    const userData = await userModel.findOne({ _id: req.body.userId });

    userData.seenNotifications = [];

    const response = await userData.save();
    response.password = undefined;

    res.status(200).send({
      message: "All notifications is Deleted",
      success: true,
      data: response,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "failed to delete messages", success: false, error });
  }
};
const getApprovedDoctorsList = async (req, res) => {
  try {
    const doctorsData = await Doctor.find({ status: "Approved" });
    if (doctorsData) {
      res
        .status(200)
        .json({
          message: "Doctor List Loaded",
          success: true,
          data: doctorsData,
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error while getting doctor list",
        success: false,
        error: error.message,
      });
  }
};
const bookAppointment = async (req, res) => {
  try {
    req.body.status = "pending";
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId }); // Use userId from req.body
    user.unseenNotification.push({
      type: "new-appointment-request",
      message: `A New Appointment request has been made by ${req.body.userInfo.name}`,
      onClickPath: "/doctor/appointments",
    });
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error booking appointment",
      error: error.message,
    });
  }
};
const checkAvailability = async (req, res) => {
  try {
    const date=moment(req.body.date,"DD-MM-YYYY").toISOString();
    const fromTime=moment(req.body.time,"HH:mm").subtract(60,'minuts').toISOString();
    const toTime=moment(req.body.time,"HH:mm").add(60,'minuts').toISOString();
    const appointments=await Appointment.find({
      doctorId,
      date,
      time:{$gte:fromTime,$lte:toTime},
      // status:"Approved"

    });
    if(appointments.length>0){
      return res.status(200).send({
        message:"Appointment not available",
        success:false
      })
    }else{
      return res.status(200).send({
        message:"Appointment available",
        success:true,
      })
        
    }
   
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error booking appointment",
      error: error.message,
    });
  }
};
const getAppointmentsList = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({userId:req.body.userId});
    if (doctorsData) {
      res
        .status(200)
        .json({
          message: "Appointments List Loaded",
          success: true,
          data: appointments,
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching appointments",
        success: false,
        error: error.message,
      });
  }
};

module.exports = {
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
};
