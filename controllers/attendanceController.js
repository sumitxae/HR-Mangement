// controllers/attendanceController.js
const Attendance = require('../models/Attendance');

// Check-In
// Check-In
const checkInHandler = async (req, res) => {
  const { employeeId, geofencedLocation, currentLocation } = req.body;

  // Validate input
  if (!employeeId || !geofencedLocation || !currentLocation) {
    return res.status(400).json({ message: 'Employee ID, geofenced location, and current location are required' });
  }

  // Check if the current location is within the geofenced area
  if (!isWithinGeofence(geofencedLocation, currentLocation, process.env.GEO_RADIUS)) {
    return res.status(403).json({ message: 'You are outside the geofenced area and cannot check in' });
  }

  try {
    const attendance = new Attendance({
      employee: employeeId,
      checkInTime: new Date(),
      geofencedLocation,
      checkOutTime: null,
      overtimeHours: 0,
    });

    await attendance.save();
    res.status(201).json({ message: 'Checked in successfully', attendance });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error checking in', error });
  }
};

// Check-Out
const checkOutHandler = async (req, res) => {
  const { attendanceId, currentLocation } = req.body;

  // Validate input
  if (!attendanceId || !currentLocation) {
    return res.status(400).json({ message: 'Attendance ID and current location are required' });
  }

  try {
    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    // Check if the current location is within the geofenced area during check-out
    if (!isWithinGeofence(attendance.geofencedLocation, currentLocation, process.env.GEO_RADIUS)) {
      return res.status(403).json({ message: 'You are outside the geofenced area and cannot check out' });
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
  getAttendanceForEmployee
};
