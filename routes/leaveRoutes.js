// backend/routes/leaveRoutes.js
const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');

// Create a new leave request
router.post('/', leaveController.createLeaveRequest);

// Get all leave requests for a specific employee
router.get('/:employeeId', leaveController.getEmployeeLeaves);

// Update leave request status
router.patch('/:leaveId/status', leaveController.updateLeaveStatus);

// Get all leave requests (Admin view)
router.get('/', leaveController.getAllLeaves);

module.exports = router;
