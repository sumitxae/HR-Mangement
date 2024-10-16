const { updateTaxSlabs, taxSlabs } = require('../utils/taxUtil');

// Controller for HR to update tax slabs
const updateTaxSlabsHandler = (req, res) => {
  const { newSlabs } = req.body;

  if (!newSlabs || !Array.isArray(newSlabs)) {
    return res.status(400).json({ message: 'Invalid tax slab data' });
  }

  try {
    updateTaxSlabs(newSlabs);
    res.status(200).json({ message: 'Tax slabs updated successfully', taxSlabs: newSlabs });
  } catch (error) {
    res.status(500).json({ message: 'Error updating tax slabs', error });
  }
};

// Controller for HR to view the current tax slabs
const getTaxSlabs = (req, res) => {
  try {
    res.status(200).json({ taxSlabs });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tax slabs', error });
  }
};

module.exports = {
  updateTaxSlabsHandler,
  getTaxSlabs
};
