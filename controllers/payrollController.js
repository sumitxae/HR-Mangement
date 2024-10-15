// controllers/payrollController.js
const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const { uploadDocument } = require('../utils/documentUtils'); // Assuming a utility function for uploading payslips

// Calculate Salary
const calculateSalary = (baseSalary, commission, deductions) => {
  const tax = (baseSalary + commission) * 0.1; // Example tax calculation (10%)
  const netSalary = baseSalary + commission - deductions - tax;
  return { netSalary, tax };
};

// Generate Payslip
const generatePayslip = async (req, res) => {
  const { employeeId, salary, commission, deductions, period } = req.body;

  try {
    const { netSalary, tax } = calculateSalary(salary, commission, deductions);

    const payroll = new Payroll({
      employee: employeeId,
      salary,
      commission,
      deductions,
      netSalary,
      tax,
      period
    });

    await payroll.save();

    // Generate and upload payslip (assumed logic)
    const payslipData = `Payslip for ${employeeId}\nSalary: ${salary}\nNet Salary: ${netSalary}\nTax: ${tax}`;
    const payslipUrl = await uploadDocument(payslipData, `${employeeId}-payslip.pdf`); // Upload to BunnyCDN

    payroll.payslipUrl = payslipUrl;
    await payroll.save();

    res.status(201).json({ message: 'Payroll processed successfully', payroll });
  } catch (error) {
    res.status(500).json({ message: 'Error generating payslip', error });
  }
};

// Get Payroll Records for Employee
const getPayrollForEmployee = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const payrollRecords = await Payroll.find({ employee: employeeId }).populate('employee');
    res.status(200).json(payrollRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payroll records', error });
  }
};

module.exports = {
  generatePayslip,
  getPayrollForEmployee
};
