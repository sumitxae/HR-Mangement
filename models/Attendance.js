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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Leave'
    }
  ]
}, {
  timestamps: true
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
