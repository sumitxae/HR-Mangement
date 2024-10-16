require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const logger = require("morgan");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");

const ErrorHandler = require('./utils/errorHandler');

const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const employeeRoutes = require('./routes/employee.routes');
const documentRoutes = require('./routes/document.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const payrollRoutes = require('./routes/payroll.routes');
const performanceRoutes = require('./routes/performance.routes');
const benefitsRoutes = require('./routes/benefits.routes');
const leaveRoutes = require('./routes/leave.routes');
const taxRoutes = require('./routes/tax.routes');
const path = require('path');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(logger("dev")); 
console.log(path.dirname);
app.use(
    expressSession({
      secret: process.env.EXPRESS_SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
    })
  );
  

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/tax', benefitsRoutes);
app.use('/api/benefits', taxRoutes);

app.all("*", (req, res, next) => {
    next(new ErrorHandler(`Page Not Found ${req.url}`, 404));
  });

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
