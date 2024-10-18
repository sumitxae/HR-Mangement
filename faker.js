const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Employee = require('./models/Employee');
const Attendance = require('./models/Attendance');
const Leave = require('./models/Leave');
const Document = require('./models/Document');
const Performance = require('./models/Performance');
const Benefits = require('./models/Benefits');
const Payroll = require("./models/Payroll")
const User = require('./models/user');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/hrms', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB', error);
        process.exit(1);
    }
};

// Create Users and Employees
// const generateUsersAndEmployees = async () => {
//     const roles = ['hr', 'employee'];
//     for (let i = 0; i < 100; i++) {
//         const user = new User({
//             name: faker.person.fullName(),
//             email: faker.internet.email(),
//             password: 'password123', // Default password for all users
//             role: roles[Math.floor(Math.random() * roles.length)]
//         });

//         const savedUser = await user.save();

//         const employee = new Employee({
//             user: savedUser._id,
//             contactDetails: {
//                 address: faker.location.streetAddress(),
//                 phone: faker.phone.number()
//             },
//             department: faker.commerce.department(),
//             hourlyRate: faker.number.int({ min: 100000, max: 999999 }), // 6-digit salary
//             performanceHistory: [],
//             documents: [],
//             attendanceRecords: [],
//             overtimeHours: faker.number.int({ min: 0, max: 50 }),
//             leaveRecords: [],
//             benefits: []
//         });

//         await employee.save();
//         console.log(`Created User & Employee ${i + 1}`);
//     }
// };

// Create Attendance records and link to Employee
// const generateAttendance = async () => {
//     const employees = await Employee.find();
//     for (const employee of employees) {
//         for (let i = 0; i < 50; i++) { // Create 50 attendance records per employee
//             const attendance = new Attendance({
//                 employee: employee._id,
//                 checkInTime: faker.date.past(),
//                 checkOutTime: faker.date.future(),
//                 overtimeHours: faker.number.int({ min: 0, max: 5 })
//             });
//             const savedAttendance = await attendance.save();

//             // Push attendance record ID to the employee's attendanceRecords array
//             employee.attendanceRecords.push(savedAttendance._id);
//         }
//         await employee.save();
//     }
//     console.log('Attendance records generated and linked to employees.');
// };

// Create Leave records and link to Employee
// const generateLeave = async () => {
//     const employees = await Employee.find();
//     for (const employee of employees) {
//         for (let i = 0; i < 50; i++) { // Create 50 leave records per employee
//             const leave = new Leave({
//                 employee: employee._id,
//                 leaveType: faker.helpers.arrayElement(['vacation', 'sick', 'personal']),
//                 startDate: faker.date.future(),
//                 endDate: faker.date.future(),
//                 status: faker.helpers.arrayElement(['approved', 'pending', 'denied']),
//                 reason: faker.lorem.sentence()
//             });
//             const savedLeave = await leave.save();

//             // Push leave record ID to the employee's leaveRecords array
//             employee.leaveRecords.push(savedLeave._id);
//         }
//         await employee.save();
//     }
//     console.log('Leave records generated and linked to employees.');
// };
const generateTodayAttendance = async () => {
    const employees = await Employee.find();

    // Get today's date at the start of the day
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day

    for (const employee of employees) {
        // Check if attendance for today already exists
        const existingAttendance = await Attendance.findOne({
            employee: employee._id,
            checkInTime: { $gte: today } // Check if there’s any check-in for today
        });

        if (!existingAttendance) {
            // If no attendance record exists for today, create a new one
            const attendance = new Attendance({
                employee: employee._id,
                checkInTime: today,
                checkOutTime: new Date(today.getTime() + 8 * 60 * 60 * 1000), // 8 hours later
                overtimeHours: faker.number.int({ min: 0, max: 5 })
            });

            const savedAttendance = await attendance.save();

            // Push attendance record ID to the employee's attendanceRecords array
            employee.attendanceRecords.push(savedAttendance._id);
            await employee.save();
        }
    }

    console.log('Today\'s attendance records generated and linked to employees.');
};

// Create Documents and link to Employee
// const generateDocuments = async () => {
//     const employees = await Employee.find();
//     for (const employee of employees) {
//         for (let i = 0; i < 50; i++) { // Create 50 document records per employee
//             const document = new Document({
//                 employee: employee._id,
//                 docName: faker.system.fileName(),
//                 docUrl: faker.internet.url()
//             });
//             const savedDocument = await document.save();

//             // Push document ID to the employee's documents array
//             employee.documents.push(savedDocument._id);
//         }
//         await employee.save();
//     }
//     console.log('Document records generated and linked to employees.');
// };

// Create Performance records and link to Employee
// const generatePerformance = async () => {
//     const employees = await Employee.find();
//     for (const employee of employees) {
//         for (let i = 0; i < 50; i++) { // Create 50 performance records per employee
//             const performance = new Performance({
//                 employee: employee._id,
//                 goals: [
//                     {
//                         title: faker.company.buzzPhrase(),
//                         description: faker.lorem.sentence(),
//                         status: faker.helpers.arrayElement(['pending', 'in-progress', 'completed'])
//                     }
//                 ],
//                 reviews: [
//                     {
//                         date: faker.date.past(),
//                         comment: faker.lorem.sentence(),
//                         reviewer: faker.person.fullName()
//                     }
//                 ]
//             });
//             const savedPerformance = await performance.save();

//             // Push performance record ID to the employee's performanceHistory array
//             employee.performanceHistory.push(savedPerformance._id);
//         }
//         await employee.save();
//     }
//     console.log('Performance records generated and linked to employees.');
// };

// // Create Benefits records and link to Employee
// const generateBenefits = async () => {
//     const employees = await Employee.find();
//     for (const employee of employees) {
//         for (let i = 0; i < 50; i++) { // Create 50 benefits records per employee
//             const benefits = new Benefits({
//                 employee: employee._id,
//                 healthInsurance: faker.datatype.boolean(),
//                 retirementPlan: faker.datatype.boolean(),
//                 enrollmentDate: faker.date.past(),
//                 changes: [
//                     {
//                         changeDate: faker.date.recent(),
//                         changeDescription: faker.lorem.sentence()
//                     }
//                 ]
//             });
//             const savedBenefits = await benefits.save();

//             // Push benefits record ID to the employee's benefits array
//             employee.benefits.push(savedBenefits._id);
//         }
//         await employee.save();
//     }
//     console.log('Benefits records generated and linked to employees.');
// };

// Create Payroll records and link to Employee
// const generatePayrolls = async () => {
//     const employees = await Employee.find();
//     for (const employee of employees) {
//         for (let i = 0; i < 50; i++) { // Create 50 payroll records per employee
//             const payroll = new Payroll({
//                 employee: employee._id,
//                 period:{
//                     start: faker.date.soon(),
//                     end: faker.date.past()
//                 },
//                 overtime: faker.number.int({ min: 0, max: 5 }),
//                 tax: faker.number.int({ min: 1, max: 30 }), 
//                 salary: faker.number.int({ min: 100000, max: 999999 }), 
//             })
//             const savedPayroll = await payroll.save();
//         }
//     }
//     console.log('Payroll records generated and linked to employees.');
// };

// Run all the generators
const generateData = async () => {
    await connectDB();
    await generateTodayAttendance();
    // await generateUsersAndEmployees();
    // await generateAttendance();
    // await generateLeave();
    // await generateDocuments();
    // await generatePayrolls();
    // await generatePerformance();
    mongoose.connection.close();
};

generateData();
