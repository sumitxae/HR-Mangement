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
  performanceHistory: [
    {
      date: { type: Date, required: true },
      review: { type: String, required: true }
    }
  ],
  documents: [
    {
      docName: { type: String, required: true }, 
      docUrl: { type: String, required: true } 
    }
  ],
  attendance: [
    {
      date: { type: Date, required: true },
      checkInTime: { type: String, required: true }, 
      checkOutTime: { type: String, required: true }, 
      geofencedLocation: { type: String, required: true } 
    }
  ],
  overtimeHours: { type: Number, default: 0 },
  leaveRecords: [
    {
      leaveType: { type: String, enum: ['vacation', 'sick', 'personal'], required: true },
      startDate: { type: Date, required: true }, 
      endDate: { type: Date, required: true }, 
      status: { type: String, enum: ['approved', 'pending', 'denied'], default: 'pending' }
    }
  ],
  benefits: {
    healthInsurance: { type: Boolean, default: false },
    retirementPlan: { type: Boolean, default: false }
  },
  goals: [
    {
      title: { type: String, required: true }, 
      description: { type: String, required: true }, 
      status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' }
    }
  ],
}, {
  timestamps: true
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
