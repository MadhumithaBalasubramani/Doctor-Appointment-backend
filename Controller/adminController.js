const Doctor = require("../Model/doctorModel")
const User = require("../Model/userModel")

const getUsersList = async(req, res) => {
    try {
        const userData = await User.find()
if (userData) {
    
    res.status(200).send({message: 'User List Loaded', success: true, data: userData})
} else {
    
    res.status(200).send({message: 'Failed to load userList - server', success: false})
}


    } catch (error) {
        res.status(500).send({message: 'Error while getting user List', success: false, error})
    }
}
const getDoctorsList = async (req, res) => {
    try {
        const doctorsData = await Doctor.find({});
        if (doctorsData) {
            res.status(200).json({ message: 'Doctor List Loaded', success: true, data: doctorsData });
        } else {
            res.status(404).json({ message: 'No doctors found', success: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error while getting doctor list', success: false, error: error.message });
    }
};
const ChangeDoctorsList = async (req, res) => {
    try {
        const { doctorId, status} = req.body;
        
        // Update doctor's status
        const doctor = await Doctor.findByIdAndUpdate(doctorId, { status });
        
        // Update user's unseen notifications
        const user = await User.findOne({ _id: doctor.userId });
        const unseenNotification = user.unseenNotification;
        unseenNotification.push({
            type: "new-doctor-request",
            message: `Your doctor account has been ${status}`,
            onClickPath: "/notifications",
        });
        user.isDoctor=status==="Approved" ? true :false;
        await user.save();

        res.status(200).send({ message: 'Doctor status updated', success: true, data: doctor });
    } catch (error) {
        console.error("Error while updating doctor status:", error);
        res.status(500).send({ message: 'Error while updating doctor status', success: false, error,});
    }
};
module.exports = {
    getUsersList,
    getDoctorsList,
    ChangeDoctorsList
}