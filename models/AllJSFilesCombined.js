const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  checkInTime: {
    type: Date,
    required: true
  },
  checkOutTime: {
    type: Date,
  },
  overtimeHours: {
    type: Number,
    default: 0
  },
  leaveRecords: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Leave'
    }
  ]
}, {
  timestamps: true
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
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
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  docName: {
    type: String,
    required: true
  },
  docUrl: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contactDetails: {
    address: String,
    phone: String
  },
  department: {
    type: String,
    required: true,
    default: 'HR'
  },
  hourlyRate: {
    type: Number,
    default: 1
  },
  performanceHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Performance'
  }],
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }
  ],
  attendanceRecords: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attendance'
  }],
  overtimeHours: { type: Number, default: 0 },
  leaveRecords: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Leave'
  }],
  benefits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Benefit'  
  }],
}, {
  timestamps: true
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
const mongoose = require('mongoose');

const geofenceSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  radius: {
    type: Number,
    required: true, // Radius in meters
  },
});

const Geofence = mongoose.model('Geofence', geofenceSchema);

module.exports = Geofence;
const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    leaveType: {
        type: String,
        enum: ['vacation', 'sick', 'personal'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['approved', 'pending', 'denied'],
        default: 'pending'
    },
    reason: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Leave = mongoose.model('Leave', leaveSchema);
module.exports = Leave;
const mongoose = require('mongoose');

const payslipSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  overtime: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    required: true
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

const Payroll = mongoose.model('Payroll', payslipSchema);
module.exports = Payroll;
const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', 
        required: true
    },
    goals: [
        {
            title: { type: String, required: true },
            description: String,
            status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' }
        }
    ],
    reviews: [
        {
            date: { type: Date, default: Date.now },
            comment: String,
            reviewer: { type: String, required: true }
        }
    ],
    developmentPlans: [
        {
            title: { type: String, required: true },
            description: String,
            status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' }
        }
    ]
}, {
    timestamps: true
});

const Performance = mongoose.model('Performance', performanceSchema);
module.exports = Performance;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['hr', 'employee'],
    default: 'employee'
  },
}, {
  timestamps: true
});

// Password hashing before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
