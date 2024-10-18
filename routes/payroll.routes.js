// routes/payrollRoutes.js
const express = require('express');
const router = express.Router();
const {
  generatePayslip,
  getPayrollForEmployee,
  checkPayrollStatus,
  getAllPayrolls
} = require('../controllers/payrollController');
const { route } = require('./tax.routes');

// Route for generating payslip
router.post('/generate', generatePayslip);

// Route for getting payroll records for an employee
router.get('/:employeeId', getPayrollForEmployee);

// Route for checking payroll status for an employee
router.get('/check/:employeeId', checkPayrollStatus);

router.get("/", getAllPayrolls);

module.exports = router;
