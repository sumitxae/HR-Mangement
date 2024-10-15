const Attendance = require('../models/Attendance');
const Geofence = require('../models/Geofence');
const { isWithinGeofence } = require('../utils/geofenceUtils');

// Check-In
const checkInHandler = async (req, res) => {
  const { employeeId, currentLocation } = req.body;

  // Validate input
  if (!employeeId || !currentLocation) {
    return res.status(400).json({ message: 'Employee ID and current location are required' });
  }

  try {
    // Retrieve the current geofenced location set by HR
    const geofence = await Geofence.findOne();
    if (!geofence) {
      return res.status(404).json({ message: 'Geofence location not set' });
    }

    const radius = geofence.radius; // Use the radius from the geofence model

    // Check if the current location is within the geofenced area
    const isInGeofence = isWithinGeofence(geofence, currentLocation, radius);
    
    if (!isInGeofence) {
      return res.status(403).json({ message: 'You are not within the geofenced area for check-in' });
    }

    // Create a new attendance record
    const attendance = new Attendance({
      employee: employeeId,
      checkInTime: new Date(),
      geofencedLocation: geofence,
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

  try {
    // Retrieve the current geofenced location set by HR
    const geofence = await Geofence.findOne();
    if (!geofence) {
      return res.status(404).json({ message: 'Geofence location not set' });
    }

    const radius = geofence.radius; // Use the radius from the geofence model

    // Check if the current location is within the geofenced area
    const isInGeofence = isWithinGeofence(geofence, currentLocation, radius);
    
    if (!isInGeofence) {
      return res.status(403).json({ message: 'You are not within the geofenced area for check-out' });
    }

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
  getAttendanceForEmployee,
};
