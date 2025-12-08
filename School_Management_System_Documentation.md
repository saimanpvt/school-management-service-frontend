# School Management System Frontend - Complete Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Authentication & User Management](#authentication--user-management)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Admin Portal Features](#admin-portal-features)
5. [Teacher Portal Features](#teacher-portal-features)
6. [Student Portal Features](#student-portal-features)
7. [Parent Portal Features](#parent-portal-features)
8. [Technical Architecture](#technical-architecture)
9. [API Integration](#api-integration)
10. [Security Features](#security-features)
11. [User Interface & Design](#user-interface--design)
12. [Setup & Installation](#setup--installation)

---

## System Overview

The School Management System Frontend is a comprehensive web application built with Next.js and TypeScript, designed to manage all aspects of school operations. It provides role-based access control for four distinct user types: **Administrators**, **Teachers**, **Students**, and **Parents**.

### Key Features
- **Role-Based Access Control (RBAC)** - Different interfaces and permissions for each user type
- **Real-time Dashboard Analytics** - Live statistics and performance metrics
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Secure Authentication** - JWT-based authentication with automatic token refresh
- **Comprehensive User Management** - Full CRUD operations for all user types
- **Academic Management** - Course, class, and curriculum management
- **Financial Management** - Fee tracking and payment processing
- **Communication Hub** - Messaging system between all stakeholders

---

## Authentication & User Management

### Authentication Flow

#### 1. **User Registration** (`/signup`) --> will be added by saiman pvt only.
- **Supported Roles**: Admin, Teacher, Student, Parent
- **Required Information**:
  - Personal Details: First Name, Last Name, Email
  - Security: Password (minimum 6 characters)
  - Role Selection: User type selection
- **Process**: 
  1. User fills registration form
  2. System validates input and creates account
  3. JWT token is generated and stored
  4. User is redirected to appropriate dashboard

#### 2. **User Login** (`/login`)
- **Credentials Required**: Email and Password
- **Security Features**:
  - Password validation
  - JWT token generation
  - Automatic role-based redirection
  - Session management
- **Login Process**:
  1. User enters credentials
  2. System validates against backend API
  3. JWT token stored in localStorage
  4. Redirect to role-specific dashboard

#### 3. **Password Management**
- **Change Password** (`/change-password`)
- **Forgot Password** - Email-based password reset
- **Admin Password Reset** - Admins can reset any user's password

#### 4. **Session Management**
- **Automatic Logout** - On token expiration or manual logout
- **Protected Routes** - Middleware ensures authenticated access
- **Token Refresh** - Automatic token renewal for active sessions

### User Data Structure
```typescript
interface User {
  uuid: string;
  userID: string; 
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  dob: string;
  gender: string;
  bloodGroup: string;
  role: UserRole; // Admin, Teacher, Student, Parent
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
}
```

---

## User Roles & Permissions

### 1. **Administrator (Admin)**
- **Full System Access** - Complete control over all system features
- **User Management** - Create, update, delete, and manage all users
- **Academic Administration** - Manage courses, classes, curricula
- **Financial Oversight** - Monitor fees, payments, and financial reports
- **System Analytics** - Access to comprehensive system statistics
- **Communication Management** - Oversee all system communications

### 2. **Teacher**
- **Class Management** - Manage assigned classes and students
- **Academic Operations** - Create assignments, conduct exams, grade work
- **Attendance Tracking** - Record and monitor student attendance

### 3. **Student**
- **Academic Dashboard** - View courses, assignments, and grades
- **Assignment Submission** - Submit homework and project work
- **Schedule Management** - View class schedules and timetables
- **Performance Tracking** - Monitor grades and academic progress
- **Fee Management** - View fee status and payment history

### 4. **Parent**
- **Child Monitoring** - Track children's academic progress
- **Multi-Child Support** - Manage multiple children's accounts
- **Financial Management** - Pay fees and view payment history
- **Progress Reports** - Access detailed academic progress reports
- **Attendance Monitoring** - Track children's attendance patterns

---

## Admin Portal Features

### Dashboard Overview (`/portal/admin/[id]/dashboard`)
- **System Statistics**:
  - Total Students: Real-time count of enrolled students
  - Total Teachers: Active teaching staff count
  - Total Courses: Available courses in the system
  - Total Revenue: Financial performance metrics // we can keep or remove.
- **Visual Analytics**: Charts and graphs for data visualization
- **Recent Activity**: Latest system activities and updates
- **Quick Actions**: Shortcuts to frequently used features

### User Management (`/portal/admin/[id]/user-management`)

#### **Comprehensive User Operations**
- **View All Users**: Paginated list with filtering and search
- **Create New Users**: 
  - Role-specific form fields
  - Automatic password generation
  - Email credential delivery
  - Bulk user creation support --> we can later on if we want.. as adding manually will be very difficult.
- **User Profile Management**:
  - Edit personal information
  - Update contact details
  - Modify role permissions
  - Account status management (Active/Inactive)

#### **Advanced Features**
- **User Search & Filter**: 
  - Filter by role (Student, Teacher, Parent, Admin)
  - Search by name, email, or User ID
  - Advanced filtering options
- **Bulk Operations**:
  - Import users from CSV/Excel
  - Bulk status updates

### Academic Management

#### **Course Management** (`/portal/admin/[id]/courses`)
- **Course Creation & Editing**:
  - Course details (name, description, code)
  - Duration and credit hours
  - Prerequisites and requirements
  - Teacher assignment
- **Course Analytics**:
  - Enrollment statistics
  - Performance metrics --> we can track the howthe growth of student in this course.


#### **Class Management** (`/portal/admin/[id]/classes`)
- **Class Structure**:
  - Grade/Year level organization
  - Section management
  - Student-teacher assignments

### Financial Management (`/portal/admin/[id]/fees`)
- **Fee Structure Management**:
  - Define fee categories
  - Set payment schedules
  - Configure late fee policies
- **Payment Tracking**:
  - Real-time payment status
  - Outstanding balances
  - Payment history and receipts
- **Financial Reports**:
  - Revenue analytics
  - Collection efficiency metrics

### Attendance Management (`/portal/admin/[id]/attendance`)
- **System-wide Attendance**: Monitor attendance across all classes
- **Attendance Reports**: Generate comprehensive attendance reports

### Examination Management (`/portal/admin/[id]/exams`)
- **Exam Scheduling**: Create and manage examination timetables =>we can do that if e want in phase-2 
- **Result Management**: Process and publish examination results
- **Report Generation**: Automated report cards and transcripts

----------------------------------TEACHER----------------------------------------------------

## Teacher Portal Features

### Teacher Dashboard (`/portal/teacher/[id]/dashboard`)
- **Class Overview**:
  - Active Classes: Number of assigned classes
  - Total Students: Students under teacher's instruction
  - Assignments to Grade: Pending grading tasks
  - Today's Attendance: Current attendance percentages
- **Daily Schedule**: Today's class timetable and activities

### Class Management (`/portal/teacher/[id]/class`)
- **Class Performance**: Monitor overall class academic performance
- **Student Profiles**: Access individual student information

### Student Management (`/portal/teacher/[id]/students`)
- **Individual Progress**: Track each student's academic journey
- **Behavioral Notes**: Record and track student behavior

### Assignment & Assessment (`/portal/teacher/[id]/assignments`)
- **Assignment Creation**:
  - Create new assignments with detailed instructions
  - Set due dates and submission requirements
  - Attach resources and reference materials
- **Submission Management**:
  - Review submitted work
  - Provide feedback and grades
  - Track submission status
- **Grade Book**: Comprehensive grading and scoring system

### Attendance Management (`/portal/teacher/[id]/attendance`)
- **Daily Attendance**: Record daily class attendance
- **Attendance Reports**: Generate attendance summaries
- **Parent Notifications**: Automated alerts for absences * must I belive

### Examination Tools (`/portal/teacher/[id]/exams`)
- **Exam Creation**: Design and schedule assessments
- **Question Bank**: Manage reusable questions and answers
- **Result Processing**: Grade exams and calculate scores
- **Performance Analysis**: Analyze exam results and trends

-----------------------------------STUDENTS--------------------------------------------------

## Student Portal Features

### Student Dashboard (`/portal/student/[id]/dashboard`)
- **Academic Overview**:
  - Courses Enrolled: Current course load
  - Assignments Due: Upcoming submission deadlines
  - Average Grade: Current academic performance
  - Attendance Rate: Personal attendance percentage
- **Performance Trends**: Visual representation of academic progress

### Course Management (`/portal/student/[id]/courses`)
- **Course Catalog**: All enrolled courses with details
- **Course Materials**: Access to syllabi, resources, and references
- **Course Progress**: Track completion and performance per course
- **Course Schedule**: Class timings and locations

### Assignment Portal (`/portal/student/[id]/assignments`)
- **Assignment List**: All current and past assignments
- **Submission System**: Upload and submit assignment files
- **Feedback Review**: View teacher feedback and grades
- **Progress Tracking**: Monitor assignment completion status

### Grade Center (`/portal/student/[id]/grades`)
- **Grade Book**: Comprehensive view of all grades
- **Progress Reports**: Detailed academic progress analysis
- **GPA Calculation**: Current and cumulative grade point average
- **Performance Trends**: Visual charts of academic performance

### Attendance Tracking (`/portal/student/[id]/attendance`)
- **Personal Attendance**: Individual attendance records
- **Absence Management**: View and justify absences

### Examination Center (`/portal/student/[id]/exams`)
- **Exam Schedule**: Upcoming examination timetable
- **Exam Preparation**: Study materials and resources ->we can take this one in phase 2
- **Result History**: Past examination results and analysis
- **Performance Analytics**: Exam performance trends

### Fee Management (`/portal/student/[id]/fees`)
- **Fee Dashboard**: Current fee status and outstanding amounts
- **Payment History**: Record of all fee payment


--------------------------------------PARENT------------------------------------------------

## Parent Portal Features

### Parent Dashboard (`/portal/parent/[id]/dashboard`)
- **Multi-Child Support**: Switch between multiple children's profiles
- **Child Performance Overview**:
  - Current Average: Child's academic performance
  - Attendance Rate: Child's attendance percentage  
  - Upcoming Tests: Scheduled assessments
- **Financial Summary**: Fee status and payment information
- **Recent Updates**: Latest academic and behavioral updates

### Child Progress Monitoring (`/portal/parent/[id]/progress`)
- **Academic Performance**: Detailed grade analysis per subject
- **Performance Trends**: Long-term academic progress tracking

### Attendance Monitoring (`/portal/parent/[id]/attendance`)
- **Daily Attendance**: Real-time attendance updates
- **Attendance Patterns**: Weekly and monthly attendance trends
- **Attendance Reports**: Detailed attendance summaries

### Financial Management (`/portal/parent/[id]/fees`)
- **Fee Dashboard**: Current fee obligations and status
- **Payment Processing**: Secure online fee payment system
- **Payment History**: Complete record of all transactions
- **Receipt Generation**: Instant receipt download and printing

### Examination Overview (`/portal/parent/[id]/exams`)
- **Exam Schedule**: Child's upcoming examination timetable
- **Preparation Support**: Study guides and preparation materials
- **Result Analysis**: Detailed examination result review
- **Performance Trends**: Long-term academic performance tracking

---

## Technical Architecture

### Frontend Technology Stack
- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript for type safety
- **Styling**:Custom CSS Modules
- **State Management**: React Context API + Local State
- **HTTP Client**: Axios with interceptors
- **Charts & Analytics**: Recharts library
- **Icons**: Lucide React icons
- **Authentication**: JWT-based with localStorage

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main application layout
│   ├── PortalLayout.tsx # Portal-specific layout
│   ├── UserForm.tsx    # User management forms
│   ├── CustomAlert.tsx # Alert/notification component
│   └── LoadingDots.tsx # Loading indicators
├── pages/              # Next.js pages and routing
│   ├── portal/         # Role-based portal pages
│   │   ├── admin/      # Admin-specific pages
│   │   ├── teacher/    # Teacher-specific pages
│   │   ├── student/    # Student-specific pages
│   │   └── parent/     # Parent-specific pages
│   ├── login/          # Authentication pages
│   └── signup/         # Registration pages
├── services/           # API integration layer
│   ├── api.ts          # Main API configuration
│   ├── authApi.ts      # Authentication services
│   └── [role].service.ts # Role-specific services
├── lib/                # Utility libraries
│   ├── auth.tsx        # Authentication context
│   └── types.ts        # TypeScript type definitions
├── utils/              # Helper functions
│   └── routing.ts      # Dynamic routing utilities
└── styles/             # Global and component styles
```

### Authentication Architecture

#### JWT Token Management
- **Token Storage**: localStorage for persistence
- **Automatic Injection**: Axios interceptors add tokens to requests
- **Token Refresh**: Automatic renewal for active sessions
- **Security**: Automatic logout on token expiration

#### Protected Route System
```typescript
<ProtectedRoute roles={['Admin', 'Teacher']}>
  <ComponentContent />
</ProtectedRoute>
```

#### Role-Based Routing
```typescript
const getDashboardUrl = (role: UserRole, id: string): string => {
  switch (role) {
    case 'Admin': return `/portal/admin/${id}/dashboard`;
    case 'Teacher': return `/portal/teacher/${id}/dashboard`;
    case 'Student': return `/portal/student/${id}/dashboard`;
    case 'Parent': return `/portal/parent/${id}/dashboard`;
  }
};
```

---

## API Integration

### Base Configuration
```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Authentication APIs
- **POST** `/auth/login` - User authentication
- **POST** `/auth/register` - User registration  
- **POST** `/auth/logout` - Session termination
- **POST** `/auth/change-password` - Password modification
- **POST** `/auth/forgot-password` - Password reset initiation

### User Management APIs
- **GET** `/users` - Retrieve all users
- **GET** `/users/:id` - Get specific user
- **POST** `/users` - Create new user
- **PUT** `/users/:id` - Update user information
- **DELETE** `/users/:id` - Remove user
- **GET** `/users/role/:role` - Get users by role

### Administrative APIs
- **GET** `/admin/dashboard-stats` - System statistics
- **GET** `/admin/users` - All system users
- **PATCH** `/admin/users/:id/toggle-status` - Enable/disable users
- **POST** `/admin/users/:id/reset-password` - Password reset
- **POST** `/admin/send-credentials` - Email user credentials

### Academic Management APIs
- **GET** `/courses` - Course catalog
- **POST** `/courses` - Create new course
- **PUT** `/courses/:id` - Update course
- **DELETE** `/courses/:id` - Remove course
- **GET** `/classes` - Class management
- **GET** `/assignments` - Assignment management
- **GET** `/exams` - Examination system

### Financial Management APIs
- **GET** `/fees` - Fee structure and payments
- **POST** `/fees/payment` - Process payments
- **GET** `/fees/reports` - Financial reports

---

## Security Features

### Authentication Security
- **JWT Tokens**: Secure, stateless authentication
- **Password Hashing**: Bcrypt encryption for passwords
- **Session Management**: Automatic logout on inactivity
- **Token Expiration**: Configurable token lifetime

### Authorization & Access Control
- **Role-Based Access**: Strict role-based permissions
- **Route Protection**: Middleware prevents unauthorized access
- **Component-Level Security**: Protected components and features
- **API Security**: Backend validation for all operations

### Data Protection
- **Input Validation**: Client and server-side validation
- **XSS Prevention**: Input sanitization and encoding
- **CSRF Protection**: Cross-site request forgery prevention
- **Data Encryption**: Sensitive data encryption in transit

### Privacy & Compliance
- **Data Minimization**: Collect only necessary information
- **User Consent**: Clear privacy policies and consent
- **Data Retention**: Configurable data retention policies
- **Audit Trails**: Activity logging for compliance

---

## User Interface & Design

### Design System
- **Color Palette**:
  - Primary: Blue (#6366f1) for main actions
  - Success: Green (#059669) for positive states
  - Warning: Amber (#d97706) for cautions
  - Error: Red (#dc2626) for errors
  - Neutral: Gray (#6b7280) for text and borders

### Component Library
- **Buttons**: Primary, secondary, and danger variants
- **Forms**: Consistent form styling and validation
- **Tables**: Responsive data tables with sorting
- **Cards**: Content containers with consistent styling
- **Modals**: Overlay dialogs for actions and forms
- **Navigation**: Sidebar and breadcrumb navigation

### Responsive Design
- **Mobile First**: Designed for mobile devices first
- **Tablet Optimization**: Optimized layouts for tablets
- **Desktop Enhancement**: Enhanced features for desktop
- **Cross-Browser**: Tested across major browsers

### Accessibility Features
- **WCAG Compliance**: Follows accessibility guidelines
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Compatible with assistive technologies
- **Color Contrast**: High contrast for readability
- **Focus Management**: Clear focus indicators

---

## Setup & Installation

### Prerequisites
- **Node.js**: Version 16+ required
- **npm**: Package manager (included with Node.js)
- **Backend API**: Separate backend service required

### Installation Steps

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd school-management-service-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment template
   Copy-Item .env.example .env.local
   
   # Configure backend API URL
   # Edit .env.local and set:
   NEXT_PUBLIC_API_URL=http://your-backend-api-url
   ```

4. **Development Server**
   ```bash
   npm run dev
   ```
   Application available at: http://localhost:3000

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

### Environment Variables
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Application Settings
NEXT_PUBLIC_APP_NAME=School Management System
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint code analysis
- `npm run type-check` - TypeScript type checking

---

## Conclusion

This School Management System Frontend provides a comprehensive, secure, and user-friendly platform for managing all aspects of educational institutions. With its role-based architecture, responsive design, and extensive feature set, it serves the needs of administrators, teachers, students, and parents while maintaining high standards of security and usability.

The modular architecture allows for easy maintenance and feature expansion, while the TypeScript implementation ensures code reliability and maintainability. The system is designed to scale with growing institutions and can be customized to meet specific organizational requirements.

For technical support or feature requests, please refer to the project repository and documentation.

---

*Last Updated: December 7, 2025*
*Version: 1.0.0*