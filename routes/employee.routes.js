// routes/employeeRoutes.js
const express = require('express');
const { protect, isHR } = require('../middlewares/authMiddleware');
const {
  getAllEmployees,
  createOrUpdateEmployee,
  uploadEmployeeDocument,
  calculateOvertime,
  getEmployeeDetails,
  generateEmployeePayslip,
} = require('../controllers/employeeController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Directory for uploaded files

const router = express.Router();

// Get all employees
router.post('/', protect, getAllEmployees);

router.post('/:id', protect, getEmployeeDetails);

// Create or update employee
router.post('/create-or-update', createOrUpdateEmployee);

// Upload employee document
router.post('/upload-document', protect, isHR, upload.single('document'), uploadEmployeeDocument);

// Calculate overtime
router.post('/overtime', protect, calculateOvertime);

// Generate payslip
router.post('/payslip', protect, generateEmployeePayslip);

module.exports = router;
