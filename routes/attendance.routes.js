// routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const {
  checkInHandler,
  checkOutHandler,
  getAttendanceForEmployee,
  updateGeofenceLocation,
  getAttendanceRecords
} = require('../controllers/attendanceController');
const { isHR, protect } = require('../middlewares/authMiddleware');

// Route for checking in
router.post('/checkin', protect, checkInHandler);

// Route for checking out
router.post('/checkout', protect, checkOutHandler);

// Route for setting company/office location
router.put('/setLocation', protect, isHR, updateGeofenceLocation);

// Route for getting attendance records for a specific employee
router.get('/:employeeId', protect, getAttendanceForEmployee);


router.get('/', protect, isHR, getAttendanceRecords);

module.exports = router;
