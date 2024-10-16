let taxSlabs = [
    { min: 300000, max: 500000, rate: 0 },   // 3-5 Lacs: No tax
    { min: 500001, max: 900000, rate: 0.05 }, // 5-9 Lacs: 5%
    { min: 900001, max: 1500000, rate: 0.1 }, // 9-15 Lacs: 10%
    { min: 1500001, max: Infinity, rate: 0.15 } // Above 15 Lacs: 15%
  ];
  
  const calculateTax = (salary) => {
    let tax = 0;
  
    // Find the applicable tax slab
    for (const slab of taxSlabs) {
      if (salary >= slab.min && salary <= slab.max) {
        tax = salary * slab.rate;
        break;
      }
    }
  
    return tax;
  };
  
  // Utility to update tax slabs (used in HR route)
  const updateTaxSlabs = (newSlabs) => {
    taxSlabs = newSlabs;
  };
  
  module.exports = {
    calculateTax,
    updateTaxSlabs,
    taxSlabs 
  };
  