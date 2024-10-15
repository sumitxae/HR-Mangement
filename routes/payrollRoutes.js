// routes/payrollRoutes.js
const express = require('express');
const router = express.Router();
const {
  generatePayslip,
  getPayrollForEmployee
} = require('../controllers/payrollController');

// Route for generating payslip
router.post('/generate', generatePayslip);

// Route for getting payroll records for a specific employee
router.get('/:employeeId', getPayrollForEmployee);

module.exports = router;
