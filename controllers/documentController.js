const Document = require('../models/Document');
const Employee = require('../models/Employee');
const { uploadDocument } = require('../utils/documentUtils');

// Upload Document
const uploadDocumentHandler = async (req, res) => {
  const { employeeId, docName } = req.body;
  const file = req.file;
  const employee = await Employee.findById(employeeId);

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  if (!employee) { 
    return res.status(404).json({ message: 'Employee not found' });
   }

  try {
    const docUrl = await uploadDocument(file);
    const document = new Document({
      employee: employeeId,
      docName,
      docUrl
    });
    employee.documents.push(document);
    await employee.save();
    await document.save();
    res.status(201).json({ message: 'Document uploaded successfully', document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading document', error });
  }
};

// Get Documents for an Employee
const getDocumentsForEmployee = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const documents = await Document.find({ employee: employeeId });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents', error });
  }
};

module.exports = {
  uploadDocumentHandler,
  getDocumentsForEmployee
};
