// backend/routes/leaveRoutes.js
const express = require('express');
const router = express.Router();
const {
    createLeaveRequest,
    getEmployeeLeaves,
    updateLeaveStatus,
    getAllLeaves,
} = require('../controllers/leaveControllers');

// Create a new leave request
router.post('/', createLeaveRequest);

// Get all leave requests for a specific employee
router.get('/:employeeId', getEmployeeLeaves);

// Update leave request status
router.patch('/:leaveId/status', updateLeaveStatus);

// Get all leave requests (Admin view)
router.get('/', getAllLeaves);

module.exports = router;
