const { calculateAttendanceForEmployee } = require('../utils/attendanceCheckUtil');
const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const { calculateTax } = require('../utils/taxUtil');

// Generate Payslips for all employees on 1st of each month
const generatePayslip = async (req, res) => {
  const startOfMonth = new Date(new Date().setDate(1));
  const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0); 

  try {
    const employees = await Employee.find({});

    for (const employee of employees) {
      const existingPayslip = await Payroll.findOne({
        employee: employee._id,
        'period.start': { $gte: startOfMonth },
        'period.end': { $lte: endOfMonth }
      });

      if (existingPayslip) {
        // Payroll for this month has already been processed for this employee
        continue;
      }

      const { totalHoursWorked, totalOvertime } = await calculateAttendanceForEmployee(employee._id, startOfMonth, endOfMonth);

      const salary = (employee.hourlyRate * totalHoursWorked) + (employee.hourlyRate * 1.5 * totalOvertime);
      const tax = calculateTax(salary); 

      const payslip = new Payroll({
        employee: employee._id,
        salary,
        tax,
        period: {
          start: startOfMonth,
          end: endOfMonth
        }
      });

      await payslip.save();
    }

    res.status(200).json({ message: 'Payslips generated successfully for this month' });
  } catch (error) {
    res.status(500).json({ message: 'Error generating payslips', error });
  }
};

// Check Payroll Status for an Employee
const checkPayrollStatus = async (req, res) => {
  const { employeeId } = req.params;
  const startOfMonth = new Date(new Date().setDate(1));
  const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  try {
    const payroll = await Payroll.findOne({
      employee: employeeId,
      'period.start': { $gte: startOfMonth },
      'period.end': { $lte: endOfMonth }
    });

    if (!payroll) {
      return res.status(200).json({ message: 'Payroll not processed for this month' });
    }

    res.status(200).json({ message: 'Payroll processed', payroll });
  } catch (error) {
    res.status(500).json({ message: 'Error checking payroll status', error });
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
  checkPayrollStatus,
  getPayrollForEmployee
};
