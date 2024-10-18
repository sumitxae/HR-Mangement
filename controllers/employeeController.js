const Employee = require('../models/Employee');
const { uploadDocument, generatePayslip } = require('../utils/documentUtils'); // Placeholder for document upload utility functions

const getAllEmployees = async (req, res) => {
  try {
    console.log("Fetching all employees...");
    const employees = await Employee.find()
      .populate('user', 'name email')
      .populate('documents')
      .populate('attendanceRecords')
      .populate('leaveRecords');

    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error); // Log the full error
    res.status(500).json({ message: error.message });
  }
};


const getEmployeeDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findById(id).populate('user', 'name email').populate('documents').populate('attendanceRecords').populate('leaveRecords');
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create or Update employee information
const createOrUpdateEmployee = async (req, res) => {
  const { userName, contactDetails, jobRole, hourlyRate} = req.body;
  try {
    console.log(req.body)
    const employee = await Employee.findOneAndUpdate(
      { user: userName },
      { contactDetails, jobRole, salary, hourlyRate },
      { new: true, upsert: true }
    );
    console.log("dfg")
    res.status(200).json("employee");
  } catch (error) {
    console.log(error.message)
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
  calculateOvertime,
  generateEmployeePayslip,
  getEmployeeDetails
};
