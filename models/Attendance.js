// models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  checkInTime: {
    type: Date,
    required: true
  },
  checkOutTime: {
    type: Date,
    required: true
  },
  geofencedLocation: {
    type: String,
    required: true
  },
  overtimeHours: {
    type: Number,
    default: 0
  },
  leaveRecords: [
    {
      leaveType: { type: String, enum: ['vacation', 'sick', 'personal'], required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      status: { type: String, enum: ['approved', 'pending', 'denied'], default: 'pending' }
    }
  ]
}, {
  timestamps: true
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
