const Attendance = require('../models/Attendance');

// Utility function to calculate attendance for a specific employee within a date range
const calculateAttendanceForEmployee = async (employeeId, startOfMonth, endOfMonth) => {
  try {
    const attendanceRecords = await Attendance.find({
      employee: employeeId,
      checkInTime: { $gte: startOfMonth, $lte: endOfMonth }
    });

    let totalHoursWorked = 0;
    let totalOvertime = 0;

    attendanceRecords.forEach(record => {
      if (record.checkInTime && record.checkOutTime) {
        const hoursWorked = (new Date(record.checkOutTime) - new Date(record.checkInTime)) / (1000 * 60 * 60); // Convert milliseconds to hours
        totalHoursWorked += hoursWorked;
        totalOvertime += record.overtimeHours; // Sum the overtime hours
      }
    });

    return {
      totalHoursWorked,
      totalOvertime,
      attendanceCount: attendanceRecords.length // Number of attendance records (days)
    };
  } catch (error) {
    console.error('Error calculating attendance:', error);
    throw new Error('Failed to calculate attendance.');
  }
};

module.exports = {
  calculateAttendanceForEmployee
};
