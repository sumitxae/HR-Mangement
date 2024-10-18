const cron = require('node-cron');
const { generatePayslipForAllEmployees } = require('../utils/payrollUtil');

// Schedule a task to generate payslips on the 1st day of every month at midnight
cron.schedule('0 0 1 * *', async () => {
  try {
    console.log('Running payroll generation job');
    const result = await generatePayslipForAllEmployees();
    console.log(result.message);
  } catch (error) {
    console.error('Error generating payroll:', error);
  }
});
