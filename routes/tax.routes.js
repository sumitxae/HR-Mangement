const express = require('express');
const { updateTaxSlabsHandler, getTaxSlabs } = require('../controllers/taxController');
const router = express.Router();
const { protect, isHR } = require('../middlewares/authMiddleware');


// Route to update tax slabs (for HR)
router.put('/update-tax-slabs', protect, isHR, updateTaxSlabsHandler);

// Route to view current tax slabs
router.get('/current-tax-slabs', getTaxSlabs);

module.exports = router;
