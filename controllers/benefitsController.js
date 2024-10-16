const Benefits = require('../models/Benefits');

// Enroll Employee in Benefits
const enrollBenefits = async (req, res) => {
  const { employeeId, healthInsurance, retirementPlan } = req.body;

  try {
    const benefits = new Benefits({
      employee: employeeId,
      healthInsurance,
      retirementPlan
    });

    await benefits.save();

    res.status(201).json({ message: 'Employee enrolled in benefits successfully', benefits });
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling employee in benefits', error });
  }
};

// Update Benefits
const updateBenefits = async (req, res) => {
  const { employeeId } = req.params;
  const { healthInsurance, retirementPlan, changeDescription } = req.body;

  try {
    const benefits = await Benefits.findOne({ employee: employeeId });

    if (!benefits) {
      return res.status(404).json({ message: 'Benefits record not found' });
    }

    benefits.healthInsurance = healthInsurance !== undefined ? healthInsurance : benefits.healthInsurance;
    benefits.retirementPlan = retirementPlan !== undefined ? retirementPlan : benefits.retirementPlan;

    if (changeDescription) {
      benefits.changes.push({ changeDescription });
    }

    await benefits.save();

    res.status(200).json({ message: 'Benefits updated successfully', benefits });
  } catch (error) {
    res.status(500).json({ message: 'Error updating benefits', error });
  }
};

// Get Benefits for an Employee
const getBenefitsForEmployee = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const benefits = await Benefits.findOne({ employee: employeeId }).populate('employee');
    res.status(200).json(benefits);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching benefits data', error });
  }
};

module.exports = {
  enrollBenefits,
  updateBenefits,
  getBenefitsForEmployee
};
