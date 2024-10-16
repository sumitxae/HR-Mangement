const Attendance = require('../models/Attendance');
const Geofence = require('../models/Geofence'); 
const { isWithinGeofence } = require('../utils/geofencing');
const moment = require('moment'); 

// Update Geofence Location (HR can set a new location)
const updateGeofenceLocation = async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required.' });
    }

    // Find the existing geofence location, if any
    let geofence = await Geofence.findOne();

    if (geofence) {
      geofence.latitude = latitude;
      geofence.longitude = longitude;
      geofence.radius = radius;
      await geofence.save();
    } else {
      geofence = await Geofence.create({ latitude, longitude, radius });
    }

    res.status(200).json({ success: true, message: 'Geofence location updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

// Check-In
const checkInHandler = async (req, res) => {
  const { employeeId, currentLocation } = req.body;
  const geofencedLocation = await Geofence.findOne();

  if (!geofencedLocation) {
    return res.status(400).json({ message: 'Geofenced location is not set. HR needs to set the geofenced location first' });
  }

  if (!employeeId || !currentLocation) {
    return res.status(400).json({ message: 'Employee ID and current location are required' });
  }

  // Check if the current location is within the geofenced area
  if (!isWithinGeofence(geofencedLocation, currentLocation, geofencedLocation.radius)) {
    return res.status(403).json({ message: 'You are outside the geofenced area and cannot check in' });
  }

  try {
    // Check if the employee has already checked in today
    const today = moment().startOf('day'); 
    const existingAttendance = await Attendance.findOne({
      employee: employeeId,
      checkInTime: {
        $gte: today.toDate(), 
        $lt: moment(today).endOf('day').toDate() 
      }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'You have already checked in today.' });
    }

    // Allow check-in if no record exists for today
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
    res.status(500).json({ message: 'Error checking in', error });
  }
};

// Check-Out
const checkOutHandler = async (req, res) => {
  const { attendanceId, currentLocation } = req.body;
  const geofencedLocation = await Geofence.findOne(); 

  if (!geofencedLocation) {
    return res.status(400).json({ message: 'Geofenced location is not set. HR needs to set the geofenced location first' });
  }

  if (!attendanceId || !currentLocation) {
    return res.status(400).json({ message: 'Attendance ID and current location are required' });
  }

  try {
    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    // Check if the current location is within the geofenced area during check-out
    if (!isWithinGeofence(geofencedLocation, currentLocation, geofencedLocation.radius)) {
      return res.status(403).json({ message: 'You are outside the geofenced area and cannot check out' });
    }

    attendance.checkOutTime = new Date();
    const checkInTime = new Date(attendance.checkInTime);
    const hoursWorked = (attendance.checkOutTime - checkInTime) / (1000 * 60 * 60);

    // Calculate overtime if applicable
    if (hoursWorked > 8) { 
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
  updateGeofenceLocation
};
