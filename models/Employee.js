const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contactDetails: {
    address: String,
    phone: String
  },
  department: {
    type: String,
    required: true,
    default: 'HR'
  },
  hourlyRate: {
    type: Number,
    default: 1
  },
  performanceHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Performance'
  }],
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }
  ],
  attendanceRecords: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attendance'
  }],
  overtimeHours: { type: Number, default: 0 },
  leaveRecords: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Leave'
  }],
  benefits: [{
    healthInsurance: { type: Boolean, default: false },
    retirementPlan: { type: Boolean, default: false },

  }],
}, {
  timestamps: true
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
