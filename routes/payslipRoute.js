// routes/payslip.js
const express = require('express');
const { generatePayslip, savePayslipToFile } = require('../utils/documentUtils');
const Employee = require('../models/Employee');

const router = express.Router();

// Route to generate payslip
router.post('/generate-payslip/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const { salary, deductions, month, year } = req.body;

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const salaryDetails = { salary, deductions, month, year };
    const payslip = generatePayslip(employee, salaryDetails);
    
    // Optionally save the payslip to a file
    const fileName = `${employee.name.replace(/\s/g, '_')}_payslip_${month}_${year}.json`;
    const filePath = savePayslipToFile(payslip, fileName);

    return res.status(200).json({ message: 'Payslip generated successfully', payslip, filePath });
  } catch (error) {
    console.error('Error generating payslip:', error);
    return res.status(500).json({ message: 'Error generating payslip' });
  }
});

module.exports = router;
