// controllers/documentController.js
const Document = require('../models/Document');
const Employee = require('../models/Employee');
const { uploadDocument } = require('../utils/documentUtils'); // Assume a utility function for uploading documents to BunnyCDN

// Upload Document
const uploadDocumentHandler = async (req, res) => {
  const { employeeId, docName } = req.body;
  const file = req.file; // Assuming you use multer for file uploads

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Upload to BunnyCDN
    const docUrl = await uploadDocument(file); // Function to handle uploading to BunnyCDN

    const document = new Document({
      employee: employeeId,
      docName,
      docUrl
    });

    await document.save();

    res.status(201).json({ message: 'Document uploaded successfully', document });
  } catch (error) {
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
