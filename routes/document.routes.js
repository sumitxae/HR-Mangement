// routes/documentRoutes.js
const express = require('express');
const router = express.Router();
const { uploadDocumentHandler, getDocumentsForEmployee } = require('../controllers/documentController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); 

// Route for uploading a document
router.post('/upload', upload.single('document'), uploadDocumentHandler);

// Route for getting documents for a specific employee
router.get('/:employeeId', getDocumentsForEmployee);

module.exports = router;
