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

router.route('/').get(protect, isHR, getAllEmployees); // Get all employees
router.route('/create-or-update').post(protect, isHR, createOrUpdateEmployee); // Create or update employee
router.route('/upload-document').post(protect, isHR, upload.single('document'), uploadEmployeeDocument); // Upload employee document
router.route('/attendance').post(protect, logAttendance); // Log attendance
router.route('/overtime').post(protect, calculateOvertime); // Calculate overtime
router.route('/payslip').post(protect, generateEmployeePayslip); // Generate payslip

module.exports = router;
