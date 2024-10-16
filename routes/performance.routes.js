// backend/routes/performanceRoutes.js
const express = require('express');
const router = express.Router();
const {
    createPerformanceRecord,
    setGoal,
    addReview,
    addDevelopmentPlan,
    getPerformanceRecords
} = require('../controllers/performanceController');

// Create or update performance record
router.post('/', createPerformanceRecord);

// Set a goal for an employee
router.post('/goals', setGoal);

// Add a performance review
router.post('/reviews', addReview);

// Add an employee development plan
router.post('/development-plans', addDevelopmentPlan);

// Get all performance records
router.get('/', getPerformanceRecords);

module.exports = router;
