// backend/controllers/leaveController.js
const Employee = require("../models/Employee");
const Leave = require("../models/Leave");

// Create a new leave request
const createLeaveRequest = async (req, res) => {
  const { employeeId, leaveType, startDate, endDate, reason } = req.body;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const employee = await Employee.findById(employeeId);

  if (!employee) return res.status(404).json({ message: "Employee not found" });

  const leaveRequest = new Leave({
    employee: employeeId,
    leaveType,
    startDate: start,
    endDate: end,
    reason,
  });
  employee.leaveRequests.push(leaveRequest);
  await employee.save();
  try {
    const savedLeave = await leaveRequest.save();
    res.status(201).json(savedLeave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all leave requests for an employee
const getEmployeeLeaves = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const leaves = await Leave.find({ employee: employeeId });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve or deny a leave request
const updateLeaveStatus = async (req, res) => {
  const { leaveId } = req.params;
  const { status } = req.body;

  try {
    const leave = await Leave.findById(leaveId);
    if (!leave)
      return res.status(404).json({ message: "Leave request not found" });

    leave.status = status;
    await leave.save();

    res.json(leave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all leave requests (Admin view)
const getAllLeaves = async (req, res) => {
  try {
    const date = new Date();
    const leaves = await Leave.find({
      startDate: {
        $gte: new Date("2024-10-21T00:00:00Z"),
        $lte: new Date("2024-10-23T23:59:59Z"),
      },
      status: "pending",
    })
    .populate({
      path: "employee",
      populate: {
        path: "user",
        model: "User"
      }
    })
    .exec();
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLeaveRequest,
  getEmployeeLeaves,
  updateLeaveStatus,
  getAllLeaves,
};
