const {
  calculateAttendanceForEmployee,
} = require("../utils/attendanceCheckUtil");
const Payroll = require("../models/Payroll");
const { generatePayslipForAllEmployees } = require("../utils/payrollUtil");

const generatePayslip = async (req, res) => {
  try {
    const result = await generatePayslipForAllEmployees();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkPayrollStatus = async (req, res) => {
  const { employeeId } = req.params;
  const startOfMonth = new Date(new Date().setDate(1));
  const endOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  );

  try {
    const payroll = await Payroll.findOne({
      employee: employeeId,
      "period.start": { $gte: startOfMonth },
      "period.end": { $lte: endOfMonth },
    });

    if (!payroll) {
      return res
        .status(200)
        .json({ message: "Payroll not processed for this month" });
    }

    res.status(200).json({ message: "Payroll processed", payroll });
  } catch (error) {
    res.status(500).json({ message: "Error checking payroll status", error });
  }
};

const getPayrollForEmployee = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const payrollRecords = await Payroll.find({
      employee: employeeId,
    }).populate("employee");
    res.status(200).json(payrollRecords);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payroll records", error });
  }
};

const getAllPayrolls = async (req, res) => {
  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  try {
    const payrolls = await Payroll.find({
      $or: [
        { "period.start": { $gte: startOfMonth, $lte: endOfMonth } },
        { "period.end": { $gte: startOfMonth, $lte: endOfMonth } },
      ],
    }).populate({
      path: "employee",
      populate: {
        path: "user",
        model: "User",
      },
    });

    res.status(200).json(payrolls);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payroll records", error });
  }
};

module.exports = {
  generatePayslip,
  checkPayrollStatus,
  getPayrollForEmployee,
  getAllPayrolls,
};
