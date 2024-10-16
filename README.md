Sure! Below is a sample documentation for your HR Management System project. This includes a project overview, installation instructions, usage details, and API documentation.

# HR Management System Documentation

## Project Overview

The HR Management System is a web application designed to streamline and manage various HR functions, including employee information management, document management, time and attendance tracking, payroll processing, performance management, and benefits administration. The system features a user-friendly interface, secure authentication, and comprehensive API support.

### Features
- **Employee Information Management:** Centralized database for employee details, including contact information, job role, and salary.
- **Document Management:** Storage and retrieval of employee documents (e.g., resumes, certifications).
- **Time and Attendance Tracking:** Geofencing-based attendance, overtime management, and leave management.
- **Payroll Processing:** Automated salary calculations, tax deductions, and payslip generation.
- **Performance Management:** Goal setting, performance reviews, and employee development plans.
- **Benefits Administration:** Management of employee benefits, including health insurance and retirement plans.

## Technologies Used
- **Frontend:** React.js, Redux
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Token)
- **File Storage:** BunnyCDN (`bunnycdn-storage` package)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Access to BunnyCDN for file storage

### Clone the Repository
```bash
git clone https://github.com/sumitxae/HR-Mangement.git
cd HR-Management
```

### Install Dependencies
```bash
npm install
```

### Create a `.env` File
Create a `.env` file in the root directory and add the following environment variables:
```plaintext
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
BUNNYCDN_API_KEY=your_bunnycdn_api_key
BUNNYCDN_STORAGE_ZONE_NAME=your_bunnycdn_storage_zone_name
```

### Start the Server
```bash
npm start
```
The server will run on `http://localhost:5000`.

## API Documentation

### Base URL
`http://localhost:5000/api`


## **Authentication**
This API requires authentication using JWT tokens for most routes. Include the token in the `Authorization` header:
```
Authorization: Bearer <your-token-here>
```

---
# API Documentation

## Attendance Routes
**Base Path**: `/attendance`

1. **POST** `/checkin`
   - **Request**: Requires authentication (`protect`)
   - **Request Body**: 
     ```json
     {
       "employeeId": "string",
       "currentLocation": {
         "latitude": "number",
         "longitude": "number"
       }
     }
     ```
   - **Response**: 
     ```json
     {
       "message": "Checked in successfully",
       "attendance": {...}
     }
     ```

2. **POST** `/checkout`
   - **Request**: Requires authentication (`protect`)
   - **Request Body**: 
     ```json
     {
       "attendanceId": "string",
       "currentLocation": {
         "latitude": "number",
         "longitude": "number"
       }
     }
     ```
   - **Response**: 
     ```json
     {
       "message": "Checked out successfully",
       "attendance": {...}
     }
     ```

3. **PUT** `/setLocation`
   - **Request**: Requires authentication (`protect`, `isHR`)
   - **Request Body**: 
     ```json
     {
       "latitude": "number",
       "longitude": "number",
       "radius": "number"
     }
     ```
   - **Response**: 
     ```json
     {
       "success": true,
       "message": "Geofence location updated successfully."
     }
     ```

4. **GET** `/:employeeId`
   - **Request**: Requires authentication (`protect`)
   - **Response**: 
     ```json
     [
       {
         "employeeId": "string",
         "checkInTime": "string",
         "checkOutTime": "string",
         ...
       },
       ...
     ]
     ```

## Auth Routes
**Base Path**: `/auth`

1. **POST** `/register`
   - **Request Body**: 
     ```json
     {
       "username": "string",
       "password": "string",
       "email": "string",
       "role": "string"
     }
     ```
   - **Response**: 
     ```json
     {
       "message": "User registered successfully!",
       "token": "string",
       "user": { ... }
     }
     ```

2. **POST** `/login`
   - **Request Body**: 
     ```json
     {
       "username": "string",
       "password": "string"
     }
     ```
   - **Response**: 
     ```json
     {
       "token": "string",
       "role": "string",
       "details": {...}
     }
     ```

3. **POST** `/logout`
   - **Request**: Requires authentication (`protect`)
   - **Response**: 
     ```json
     {
       "message": "User logged out successfully"
     }
     ```

## Benefits Routes
**Base Path**: `/benefits`

1. **POST** `/enroll`
   - **Request Body**: 
     ```json
     {
       "employeeId": "string",
       "healthInsurance": "string",
       "retirementPlan": "string"
     }
     ```
   - **Response**: 
     ```json
     {
       "message": "Employee enrolled in benefits successfully",
       "benefits": {...}
     }
     ```

2. **PUT** `/:employeeId`
   - **Request Body**: 
     ```json
     {
       "healthInsurance": "string",
       "retirementPlan": "string",
       "changeDescription": "string"
     }
     ```
   - **Response**: 
     ```json
     {
       "message": "Benefits updated successfully",
       "benefits": {...}
     }
     ```

3. **GET** `/:employeeId`
   - **Response**: 
     ```json
     {
       "employee": "string",
       "healthInsurance": "string",
       "retirementPlan": "string",
       ...
     }
     ```

## Document Routes
**Base Path**: `/documents`

1. **POST** `/upload`
   - **Request**: Multipart/form-data
   - **Request Body**: 
     - `employeeId`: string
     - `docName`: string
     - `document`: file
   - **Response**: 
     ```json
     {
       "message": "Document uploaded successfully",
       "document": {...}
     }
     ```

2. **GET** `/:employeeId`
   - **Response**: 
     ```json
     [
       {
         "employee": "string",
         "docName": "string",
         "docUrl": "string",
         ...
       },
       ...
     ]
     ```

## Employee Routes
**Base Path**: `/employees`

1. **GET** `/`
   - **Request**: Requires authentication (`protect`, `isHR`)
   - **Response**: 
     ```json
     [
       {
         "user": {
           "name": "string",
           "email": "string"
         },
         ...
       },
       ...
     ]
     ```

2. **POST** `/create-or-update`
   - **Request**: Requires authentication (`protect`, `isHR`)
   - **Request Body**: 
     ```json
     {
       "userId": "string",
       "contactDetails": "string",
       "jobRole": "string",
       "salary": "number"
     }
     ```
   - **Response**: 
     ```json
     {
       "employee": {...}
     }
     ```

3. **POST** `/upload-document`
   - **Request**: Requires authentication (`protect`, `isHR`)
   - **Request**: Multipart/form-data
   - **Request Body**: 
     - `userId`: string
     - `document`: file
   - **Response**: 
     ```json
     {
       "employee": {...}
     }
     ```

4. **POST** `/attendance`
   - **Request**: Requires authentication (`protect`)
   - **Request Body**: 
     ```json
     {
       "userId": "string",
       "checkInTime": "string",
       "checkOutTime": "string",
       "geofencedLocation": "string"
     }
     ```
   - **Response**: 
     ```json
     {
       "employee": {...}
     }
     ```

5. **POST** `/overtime`
   - **Request**: Requires authentication (`protect`)
   - **Request Body**: 
     ```json
     {
       "userId": "string",
       "hoursWorked": "number"
     }
     ```
   - **Response**: 
     ```json
     {
       "employee": {...}
     }
     ```

6. **POST** `/payslip`
   - **Request**: Requires authentication (`protect`)
   - **Request Body**: 
     ```json
     {
       "userId": "string"
     }
     ```
   - **Response**: 
     ```json
     {
       "payslip": {...}
     }
     ```

## Leave Routes
**Base Path**: `/leaves`

1. **POST** `/`
   - **Request Body**: 
     ```json
     {
       "employeeId": "string",
       "leaveType": "string",
       "startDate": "string",
       "endDate": "string",
       "reason": "string"
     }
     ```
   - **Response**: 
     ```json
     {
       "leaveRequest": {...}
     }
     ```

2. **GET** `/:employeeId`
   - **Response**: 
     ```json
     [
       {
         "employee": "string",
         "leaveType": "string",
         "startDate": "string",
         "endDate": "string",
         ...
       },
       ...
     ]
     ```

3. **PATCH** `/:leaveId/status`
   - **Request Body**: 
     ```json
     {
       "status": "string"
     }
     ```
   - **Response**: 
     ```json
     {
       "leave": {...}
     }
     ```

4. **GET** `/`
   - **Response**: 
     ```json
     [
       {
         "employee": "string",
         "leaveType": "string",
         "startDate": "string",
         "endDate": "string",
         ...
       },
       ...
     ]
     ```

## Payroll Routes
**Base Path**: `/payroll`

1. **POST** `/generate`
   - **Response**: 
     ```json
     {
       "message": "Payslips generated successfully for this month"
     }
     ```

2. **GET** `/:employeeId`
   - **Response**: 
     ```json
     [
       {
         "employee": "string",
         "salary": "number",
         "tax": "number",
         ...
       },
       ...
     ]
     ```

3. **GET** `/check/:employeeId`
   - **Response**: 
     ```json
     {
       "message": "Payroll processed",
       "payroll": {...}
     }
     ```
## Performance Routes
**Base Path**: `/performance`

1. **POST** `/`
   - **Request Body**: 
     ```json
     {
       "employeeId": "string",
       "goals": "array",
       "reviews": "array",
       "developmentPlans": "array"
     }
     ```
   - **Response**: 
     ```json
     {
       "performanceRecord": {...}
     }
     ```

2. **POST** `/goals`
   - **Request Body**: 
     ```json
     {
       "employeeId": "string",
       "goal": "string"
     }
     ```
   - **Response**: 
     ```json
     {
       "performance": {...}
     }
     ```

3. **POST** `/reviews`
   - **Request Body**: 
     ```json
     {
       "employeeId": "string",
       "review": "string"
     }
     ```
   - **Response**: 
     ```json
     {
       "performance": {...}
     }
     ```

4. **POST** `/development-plans`
   - **Request Body**: 
     ```json
     {
       "employeeId": "string",
       "developmentPlan": "string"
     }
     ```
   - **Response**: 
     ```json
     {
       "performance": {...}
     }
     ```

5. **GET** `/`
   - **Response**: 
     ```json
     [
       {
         "employee": "string",
         "goals": "array",
         "reviews": "array",
         "developmentPlans": "array",
         ...
       },
       ...
     ]
     ```

## Tax Routes
**Base Path**: `/tax`

1. **PUT** `/update-tax-slabs`
   - **Request**: Requires authentication (`protect`, `isHR`)
   - **Request Body**: 
     ```json
     {
       "newSlabs": "array"
     }
     ```
   - **Response**: 
     ```json
     {
       "message": "Tax slabs updated successfully",
       "taxSlabs": "array"
     }
     ```

2. **GET** `/current-tax-slabs`
   - **Response**: 
     ```json
     {
       "taxSlabs": "array"
     }
     ```

## Other Utilities
- **Attendance Calculation**: Calculates attendance for a specific employee within a date range.
  - **Input**: 
    ```json
    {
      "employeeId": "string",
      "startOfMonth": "string",
      "endOfMonth": "string"
    }
    ```
  - **Output**: 
    ```json
    {
      "totalHoursWorked": "number",
      "totalOvertime": "number",
      "attendanceCount": "number"
    }
    ```

- **Document Upload**: Uploads a document to BunnyCDN.
  - **Input**: 
    ```json
    {
      "document": "file"
    }
    ```
  - **Output**: 
    ```json
    {
      "documentUrl": "string"
    }
    ```

- **Payslip Generation**: Generates a payslip for an employee.
  - **Input**: 
    ```json
    {
      "employee": "object",
      "salaryDetails": "object"
    }
    ```
  - **Output**: 
    ```json
    {
      "payslip": "object"
    }
    ```
