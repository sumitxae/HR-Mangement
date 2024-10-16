// routes/employeeRoutes.js
const express = require('express');
const { protect, isHR } = require('../middlewares/authMiddleware');
const {
  getAllEmployees,
  createOrUpdateEmployee,
  uploadEmployeeDocument,
  logAttendance,
  calculateOvertime,
  generateEmployeePayslip,
} = require('../controllers/employeeController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Directory for uploaded files

const router = express.Router();

// Get all employees
router.route('/').get(protect, isHR, getAllEmployees);

// Create or update employee
router.route('/create-or-update').post(protect, isHR, createOrUpdateEmployee); 

// Upload employee document
router.route('/upload-document').post(protect, isHR, upload.single('document'), uploadEmployeeDocument); 

// Log attendance
router.route('/attendance').post(protect, logAttendance); 

// Calculate overtime
router.route('/overtime').post(protect, calculateOvertime); 

// Generate payslip
router.route('/payslip').post(protect, generateEmployeePayslip); 

module.exports = router;
