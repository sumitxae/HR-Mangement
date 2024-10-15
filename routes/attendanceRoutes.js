// routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const {
  checkInHandler,
  checkOutHandler,
  recordLeaveHandler,
  getAttendanceForEmployee
} = require('../controllers/attendanceController');

// Route for checking in
router.post('/checkin', checkInHandler);

// Route for checking out
router.post('/checkout', checkOutHandler);

// Route for getting attendance records for a specific employee
router.get('/:employeeId', getAttendanceForEmployee);

module.exports = router;
