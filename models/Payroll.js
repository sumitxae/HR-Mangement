// models/Payroll.js
const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  commission: {
    type: Number,
    default: 0
  },
  deductions: {
    type: Number,
    default: 0
  },
  netSalary: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  payslipUrl: {
    type: String
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

const Payroll = mongoose.model('Payroll', payrollSchema);
module.exports = Payroll;
