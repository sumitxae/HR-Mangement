const mongoose = require('mongoose');

const benefitsSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  healthInsurance: {
    type: Boolean,
    default: false
  },
  retirementPlan: {
    type: Boolean,
    default: false
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  changes: [
    {
      changeDate: { type: Date, default: Date.now },
      changeDescription: String
    }
  ]
}, {
  timestamps: true
});

const Benefits = mongoose.model('Benefits', benefitsSchema);
module.exports = Benefits;
