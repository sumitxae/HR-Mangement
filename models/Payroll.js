const mongoose = require('mongoose');

const payslipSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  overtime: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    required: true
  },
  period: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  }
}, {
  timestamps: true
});

const Payroll = mongoose.model('Payroll', payslipSchema);
module.exports = Payroll;
