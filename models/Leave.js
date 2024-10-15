// backend/models/Leave.js
const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', // Reference to Employee model
        required: true
    },
    leaveType: {
        type: String,
        enum: ['vacation', 'sick', 'personal'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['approved', 'pending', 'denied'],
        default: 'pending'
    },
    reason: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Leave = mongoose.model('Leave', leaveSchema);
module.exports = Leave;
