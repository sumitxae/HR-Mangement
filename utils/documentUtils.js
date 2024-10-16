const BunnyCDNStorage = require('bunnycdn-storage').default;
const Employee = require('../models/Employee');
const path = require('path'); 
const BUNNYCDN_API_KEY = process.env.BUNNYCDN_API_KEY; 
const BUNNYCDN_STORAGE_ZONE_NAME = process.env.BUNNYCDN_STORAGE_ZONE_NAME;

// Create an instance of BunnyCDNStorage
const bunny = new BunnyCDNStorage(
    BUNNYCDN_API_KEY,
    BUNNYCDN_STORAGE_ZONE_NAME,
    "sg"
);

const uploadDocument = async (document) => {
    const filePath = document.path; // Path to the file to upload
    const fileName = document.originalname; // Get the original file name

    try {
        // Upload the document to BunnyCDN
        await bunny.uploadFile(filePath, fileName);

        // Return the URL of the uploaded document
        return `https://storage.bunnycdn.com/${BUNNYCDN_STORAGE_ZONE_NAME}/${fileName}`;
    } catch (error) {
        console.error('Error uploading document to BunnyCDN:', error);
        throw new Error('Document upload failed');
    }
};

const generatePayslip = (employee, salaryDetails) => {
    const payslip = {
      employeeName: employee.name,
      employeeId: employee._id,
      jobRole: employee.jobRole,
      salary: salaryDetails.salary,
      month: salaryDetails.month,
      year: salaryDetails.year,
    };
  
    return payslip;
  };
  
  const savePayslipToFile = (payslip, fileName) => {
    const filePath = path.join(__dirname, '../payslips', fileName);
    fs.writeFileSync(filePath, JSON.stringify(payslip, null, 2)); 
    return filePath; 
  };

module.exports = { uploadDocument, generatePayslip, savePayslipToFile };
