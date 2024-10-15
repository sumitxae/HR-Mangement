// controllers/attendanceController.js
const Attendance = require('../models/Attendance');

// Check-In
const checkInHandler = async (req, res) => {
  const { employeeId, geofencedLocation } = req.body;

  try {
    const attendance = new Attendance({
      employee: employeeId,
      checkInTime: new Date(),
      geofencedLocation
    });

    await attendance.save();
    res.status(201).json({ message: 'Checked in successfully', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error checking in', error });
  }
};

// Check-Out
const checkOutHandler = async (req, res) => {
  const { attendanceId } = req.body;

  try {
    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    attendance.checkOutTime = new Date();
    const checkInTime = new Date(attendance.checkInTime);
    const hoursWorked = (attendance.checkOutTime - checkInTime) / (1000 * 60 * 60);
    
    // Calculate overtime if applicable
    if (hoursWorked > 8) { // Assuming 8 hours is a full workday
      attendance.overtimeHours = hoursWorked - 8;
    }

    await attendance.save();
    res.status(200).json({ message: 'Checked out successfully', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error checking out', error });
  }
};

// Record Leave
const recordLeaveHandler = async (req, res) => {
  const { attendanceId, leaveType, startDate, endDate } = req.body;

  try {
    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    attendance.leaveRecords.push({ leaveType, startDate, endDate });
    await attendance.save();

    res.status(200).json({ message: 'Leave recorded successfully', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error recording leave', error });
  }
};

// Get Attendance for Employee
const getAttendanceForEmployee = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const attendanceRecords = await Attendance.find({ employee: employeeId });
    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance records', error });
  }
};

module.exports = {
  checkInHandler,
  checkOutHandler,
  recordLeaveHandler,
  getAttendanceForEmployee
};
