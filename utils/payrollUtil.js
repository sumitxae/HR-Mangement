const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const { calculateAttendanceForEmployee } = require('../utils/attendanceCheckUtil');
const { calculateTax } = require('../utils/taxUtil');

const generatePayslipForAllEmployees = async () => {
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

      if (existingPayslip) continue;

      const { totalHoursWorked, totalOvertime } = await calculateAttendanceForEmployee(employee._id, startOfMonth, endOfMonth);
      const salary = (employee.hourlyRate * totalHoursWorked) + (employee.hourlyRate * 1.5 * totalOvertime);
      const tax = calculateTax(salary); 

      const payslip = new Payroll({
        employee: employee._id,
        salary,
        tax,
        overtime: totalOvertime,
        period: {
          start: startOfMonth,
          end: endOfMonth
        }
      });

      await payslip.save();
    }

    return { message: 'Payslips generated successfully for this month' };
  } catch (error) {
    throw new Error('Error generating payslips: ' + error.message);
  }
};

module.exports = {
  generatePayslipForAllEmployees
};
