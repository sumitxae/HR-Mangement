// routes/benefitsRoutes.js
const express = require('express');
const router = express.Router();
const {
  enrollBenefits,
  updateBenefits,
  getBenefitsForEmployee
} = require('../controllers/benefitsController');

// Route for enrolling an employee in benefits
router.post('/enroll', enrollBenefits);

// Route for updating benefits
router.put('/:employeeId', updateBenefits);

// Route for getting benefits data for a specific employee
router.get('/:employeeId', getBenefitsForEmployee);

module.exports = router;
