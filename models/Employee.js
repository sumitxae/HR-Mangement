// models/Employee.js
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
  jobRole: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  performanceHistory: [
    {
      date: { type: Date, required: true },
      review: { type: String, required: true }
    }
  ],
  documents: [
    {
      docName: { type: String, required: true }, // Making docName required
      docUrl: { type: String, required: true } // Making docUrl required
    }
  ],
  attendance: [
    {
      date: { type: Date, required: true },
      checkInTime: { type: String, required: true }, // Making checkInTime required
      checkOutTime: { type: String, required: true }, // Making checkOutTime required
      geofencedLocation: { type: String, required: true } // Making geofencedLocation required
    }
  ],
  overtimeHours: { type: Number, default: 0 },
  leaveRecords: [
    {
      leaveType: { type: String, enum: ['vacation', 'sick', 'personal'], required: true },
      startDate: { type: Date, required: true }, // Making startDate required
      endDate: { type: Date, required: true }, // Making endDate required
      status: { type: String, enum: ['approved', 'pending', 'denied'], default: 'pending' }
    }
  ],
  benefits: {
    healthInsurance: { type: Boolean, default: false },
    retirementPlan: { type: Boolean, default: false }
  },
  goals: [
    {
      title: { type: String, required: true }, // Making title required
      description: { type: String, required: true }, // Making description required
      status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' }
    }
  ],
}, {
  timestamps: true
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
