// controllers/employeeController.js
const Employee = require('../models/Employee');
const { uploadDocument, generatePayslip } = require('../utils/documentUtils'); // Placeholder for document upload utility functions

// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('user', 'name email');
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create or Update employee information
const createOrUpdateEmployee = async (req, res) => {
  const { userId, contactDetails, jobRole, salary } = req.body;

  try {
    const employee = await Employee.findOneAndUpdate(
      { user: userId },
      { contactDetails, jobRole, salary },
      { new: true, upsert: true }
    );
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload employee documents
const uploadEmployeeDocument = async (req, res) => {
  const { userId } = req.body;
  const document = req.file; // this file will be uploaded via Multer middleware

  try {
    const documentUrl = await uploadDocument(document); // Upload document to storage and get the URL
    const employee = await Employee.findOneAndUpdate(
      { user: userId },
      { $push: { documents: { docName: document.originalname, docUrl: documentUrl } } },
      { new: true }
    );
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Time and Attendance Management
const logAttendance = async (req, res) => {
  const { userId, checkInTime, checkOutTime, geofencedLocation } = req.body;

  try {
    const attendance = {
      date: new Date(),
      checkInTime,
      checkOutTime,
      geofencedLocation,
    };

    const employee = await Employee.findOneAndUpdate(
      { user: userId },
      { $push: { attendance: attendance } },
      { new: true }
    );
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculate Overtime
const calculateOvertime = async (req, res) => {
  const { userId, hoursWorked } = req.body;

  try {
    const employee = await Employee.findOne({ user: userId });
    const overtimeHours = hoursWorked - 40; // Assuming 40 hours is the standard work week/ Can be change in future

    employee.overtimeHours += overtimeHours > 0 ? overtimeHours : 0;
    await employee.save();

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate Payslip
const generateEmployeePayslip = async (req, res) => {
  const { userId } = req.body;

  try {
    // Utility function to generate payslip
    const payslip = await generatePayslip(userId);
    res.status(200).json({ payslip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Exporting the functions
module.exports = {
  getAllEmployees,
  createOrUpdateEmployee,
  uploadEmployeeDocument,
  logAttendance,
  calculateOvertime,
  generateEmployeePayslip,
  // Other exports
};
