const Document = require('../models/Document');
const Employee = require('../models/Employee');
const { uploadDocument } = require('../utils/documentUtils');

// Upload Document
const uploadDocumentHandler = async (req, res) => {
  const { employeeId, docName } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const docUrl = await uploadDocument(file);
    const document = new Document({
      employee: employeeId,
      docName,
      docUrl
    });

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
