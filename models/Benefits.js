const mongoose = require('mongoose');

const BenefitSchema = new mongoose.Schema({
  healthInsurance: { type: Boolean, required: true },
  retirementPlan: { type: Boolean, required: true },
  enrollmentDate: { type: Date, required: true },
  changes: [{
    changeDate: { type: Date, required: true },
    changeDescription: { type: String, required: true }
  }]
});

module.exports = mongoose.model('Benefits', BenefitSchema);
