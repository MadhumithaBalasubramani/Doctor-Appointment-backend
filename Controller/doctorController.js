const Doctor = require("../Model/doctorModel");

const doctorInfo = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor details not found" });
    } else {
      return res
        .status(200)
        .json({
          success: true,
          message: "Fetched doctor details successfully",
          data: doctor,
        });
    }
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to get doctor info",
        error: error.message,
      });
  }
};
const doctorInfoId = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.body.doctorId});
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor details not found" });
    } else {
      return res
        .status(200)
        .json({
          success: true,
          message: "Fetched doctor details successfully",
          data: doctor,
        });
    }
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to get doctor info",
        error: error.message,
      });
  }
};

const updateDoctorInfo = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.body.userId },
      req.body,
      { new: true }
    );

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Failed to update details" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Updated", data: doctor });
    }
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to update doctor details",
        error: error.message,
      });
  }
};

module.exports = {
  doctorInfo,
  updateDoctorInfo,
  doctorInfoId
};
