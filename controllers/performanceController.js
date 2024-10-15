// backend/controllers/performanceController.js
const Performance = require('../models/Performance');

// Create or update performance record
const createPerformanceRecord = async (req, res) => {
    const { employeeId, goals, reviews, developmentPlans } = req.body;

    try {
        // Check if performance record already exists
        let performance = await Performance.findOne({ employee: employeeId });
        
        // If it exists, update it; otherwise, create a new one
        if (performance) {
            performance.goals = goals || performance.goals; // Update goals only if new ones are provided
            performance.reviews = reviews || performance.reviews; // Update reviews only if new ones are provided
            performance.developmentPlans = developmentPlans || performance.developmentPlans; // Update plans
        } else {
            performance = new Performance({ employee: employeeId, goals, reviews, developmentPlans });
        }

        const savedPerformance = await performance.save();
        res.status(201).json(savedPerformance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Goal setting
const setGoal = async (req, res) => {
    const { employeeId, goal } = req.body;

    try {
        const performance = await Performance.findOne({ employee: employeeId });
        if (!performance) return res.status(404).json({ message: 'Performance record not found' });

        performance.goals.push(goal);
        await performance.save();
        res.json(performance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Performance review
const addReview = async (req, res) => {
    const { employeeId, review } = req.body;

    try {
        const performance = await Performance.findOne({ employee: employeeId });
        if (!performance) return res.status(404).json({ message: 'Performance record not found' });

        performance.reviews.push(review);
        await performance.save();
        res.json(performance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Employee development plan
const addDevelopmentPlan = async (req, res) => {
    const { employeeId, developmentPlan } = req.body;

    try {
        const performance = await Performance.findOne({ employee: employeeId });
        if (!performance) return res.status(404).json({ message: 'Performance record not found' });

        performance.developmentPlans.push(developmentPlan);
        await performance.save();
        res.json(performance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all performance records
const getPerformanceRecords = async (req, res) => {
    try {
        const performanceRecords = await Performance.find().populate('employee');
        res.json(performanceRecords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPerformanceRecord,
    setGoal,
    addReview,
    addDevelopmentPlan,
    getPerformanceRecords
};