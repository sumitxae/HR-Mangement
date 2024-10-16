// backend/controllers/leaveController.js
const Leave = require('../models/Leave');

// Create a new leave request
exports.createLeaveRequest = async (req, res) => {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const random = new Date("2022-01-01T00:00:00Z");
    const leaveRequest = new Leave({
        employee: employeeId,
        leaveType,
        startDate: start,
        endDate: end,
        reason
    });

    try {
        const savedLeave = await leaveRequest.save();
        res.status(201).json(savedLeave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all leave requests for an employee
exports.getEmployeeLeaves = async (req, res) => {
    const { employeeId } = req.params;

    try {
        const leaves = await Leave.find({ employee: employeeId });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Approve or deny a leave request
exports.updateLeaveStatus = async (req, res) => {
    const { leaveId } = req.params;
    const { status } = req.body;

    try {
        const leave = await Leave.findById(leaveId);
        if (!leave) return res.status(404).json({ message: 'Leave request not found' });

        leave.status = status;
        await leave.save();

        if(status === 'approved') {
            const employee = await Employee.findById(leave.employee);
            employee.leaveRecords.push(leave);
            }
        res.json(leave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all leave requests (Admin view)
exports.getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find().populate('employee');
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
