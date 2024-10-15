// backend/models/Performance.js
const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', // Reference to Employee model
        required: true
    },
    goals: [
        {
            title: { type: String, required: true },
            description: String,
            status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' }
        }
    ],
    reviews: [
        {
            date: { type: Date, default: Date.now },
            comment: String,
            reviewer: { type: String, required: true }
        }
    ],
    developmentPlans: [
        {
            title: { type: String, required: true },
            description: String,
            status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' }
        }
    ]
}, {
    timestamps: true
});

const Performance = mongoose.model('Performance', performanceSchema);
module.exports = Performance;
