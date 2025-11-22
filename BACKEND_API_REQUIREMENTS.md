# Backend API & Database Requirements for Live Data

## 🎯 Current State Analysis

Currently, all dashboard and portal pages use **static/hardcoded data**. We need to replace this with **live data from the database** to create a real, functional school management system.

## 📊 Database Collections Needed

### 1. **Users Collection** (Already exists)

```javascript
{
  _id: ObjectId,
  uuid: String,
  userID: String, // STD001, TCH001, etc.
  email: String,
  firstName: String,
  lastName: String,
  role: String, // 'student', 'teacher', 'admin', 'parent'
  password: String,
  phone: String,
  address: Object,
  dob: Date,
  gender: String,
  bloodGroup: String,
  profileImage: String,
  isActive: Boolean,
  createdAt: Date,
  lastLogin: Date
}
```

### 2. **Courses Collection**

```javascript
{
  _id: ObjectId,
  courseId: String, // MATH101, SCI201
  name: String, // "Mathematics", "Physics"
  description: String,
  teacherId: String, // Reference to teacher
  teacherName: String,
  semester: String,
  credits: Number,
  schedule: {
    days: [String], // ['Monday', 'Wednesday', 'Friday']
    time: String, // "09:00 AM - 10:30 AM"
    room: String
  },
  students: [String], // Array of student IDs enrolled
  maxStudents: Number,
  startDate: Date,
  endDate: Date,
  isActive: Boolean,
  createdAt: Date
}
```

### 3. **Assignments Collection**

```javascript
{
  _id: ObjectId,
  assignmentId: String, // ASG001
  title: String,
  description: String,
  courseId: String,
  courseName: String,
  teacherId: String,
  dueDate: Date,
  maxScore: Number,
  type: String, // 'assignment', 'quiz', 'project'
  instructions: String,
  attachments: [String], // File URLs
  isActive: Boolean,
  createdAt: Date
}
```

### 4. **Submissions Collection**

```javascript
{
  _id: ObjectId,
  assignmentId: String,
  studentId: String,
  studentName: String,
  submissionDate: Date,
  files: [String], // File URLs
  comments: String,
  status: String, // 'submitted', 'late', 'pending'
  grade: Number,
  feedback: String,
  gradedBy: String, // Teacher ID
  gradedAt: Date
}
```

### 5. **Exams Collection**

```javascript
{
  _id: ObjectId,
  examId: String, // EXM001
  title: String,
  courseId: String,
  courseName: String,
  teacherId: String,
  examDate: Date,
  duration: Number, // Minutes
  maxScore: Number,
  type: String, // 'midterm', 'final', 'quiz'
  room: String,
  instructions: String,
  isActive: Boolean,
  createdAt: Date
}
```

### 6. **Grades Collection**

```javascript
{
  _id: ObjectId,
  studentId: String,
  courseId: String,
  assignmentId: String, // Optional, if grade is for assignment
  examId: String, // Optional, if grade is for exam
  type: String, // 'assignment', 'exam', 'final'
  score: Number,
  maxScore: Number,
  percentage: Number,
  grade: String, // A, B, C, etc.
  feedback: String,
  gradedBy: String, // Teacher ID
  gradedAt: Date,
  semester: String
}
```

### 7. **Attendance Collection**

```javascript
{
  _id: ObjectId,
  studentId: String,
  courseId: String,
  date: Date,
  status: String, // 'present', 'absent', 'late'
  markedBy: String, // Teacher ID
  notes: String,
  createdAt: Date
}
```

### 8. **Fees Collection**

```javascript
{
  _id: ObjectId,
  studentId: String,
  feeType: String, // 'tuition', 'library', 'lab', 'transport'
  amount: Number,
  dueDate: Date,
  paidDate: Date,
  status: String, // 'pending', 'paid', 'overdue'
  semester: String,
  paymentMethod: String,
  receiptNumber: String,
  notes: String
}
```

### 9. **Messages Collection**

```javascript
{
  _id: ObjectId,
  senderId: String,
  receiverId: String,
  senderName: String,
  senderRole: String,
  subject: String,
  message: String,
  isRead: Boolean,
  attachments: [String],
  parentMessageId: String, // For replies
  createdAt: Date
}
```

### 10. **Classes Collection**

```javascript
{
  _id: ObjectId,
  classId: String, // CLS10A
  className: String, // "Grade 10 - Section A"
  grade: String, // "10"
  section: String, // "A"
  classTeacherId: String,
  students: [String], // Array of student IDs
  maxStudents: Number,
  room: String,
  academicYear: String,
  isActive: Boolean
}
```

## 🔗 Required API Endpoints

### **Dashboard APIs**

#### 1. Student Dashboard

```
GET /api/students/:id/dashboard
Response: {
  coursesEnrolled: Number,
  pendingAssignments: Number,
  averageGrade: String,
  attendance: Number,
  upcomingExams: Number,
  recentActivities: Array,
  upcomingAssignments: Array,
  recentGrades: Array
}
```

#### 2. Teacher Dashboard

```
GET /api/teachers/:id/dashboard
Response: {
  totalStudents: Number,
  activeClasses: Number,
  pendingGrades: Number,
  upcomingEvents: Number,
  classPerformance: Array,
  upcomingSchedule: Array,
  recentActivities: Array,
  quickStats: Object
}
```

#### 3. Admin Dashboard

```
GET /api/admin/dashboard
Response: {
  totalStudents: Number,
  totalTeachers: Number,
  totalCourses: Number,
  totalRevenue: Number,
  recentActivity: Array,
  monthlyStats: Object,
  systemHealth: Object
}
```

#### 4. Parent Dashboard

```
GET /api/parents/:id/dashboard
Response: {
  children: Array,
  upcomingEvents: Array,
  recentGrades: Array,
  attendanceOverview: Array,
  feeStatus: Array
}
```

### **Course Management APIs**

```
GET    /api/courses                    # Get all courses
GET    /api/courses/:id               # Get course details
POST   /api/courses                   # Create course
PUT    /api/courses/:id               # Update course
DELETE /api/courses/:id               # Delete course
GET    /api/courses/:id/students      # Get enrolled students
POST   /api/courses/:id/enroll        # Enroll student
POST   /api/courses/:id/unenroll      # Unenroll student
```

### **Assignment Management APIs**

```
GET    /api/assignments                     # Get all assignments
GET    /api/assignments/:id                # Get assignment details
POST   /api/assignments                    # Create assignment
PUT    /api/assignments/:id                # Update assignment
DELETE /api/assignments/:id                # Delete assignment
GET    /api/assignments/:id/submissions    # Get all submissions
POST   /api/assignments/:id/submit         # Submit assignment
GET    /api/students/:id/assignments       # Get student's assignments
GET    /api/teachers/:id/assignments       # Get teacher's assignments
```

### **Grade Management APIs**

```
GET    /api/grades/student/:id              # Get student's grades
GET    /api/grades/course/:id               # Get course grades
POST   /api/grades                          # Create/Update grade
GET    /api/grades/assignment/:id           # Get assignment grades
GET    /api/teachers/:id/pending-grades     # Pending grades to review
POST   /api/grades/bulk                     # Bulk grade update
```

### **Attendance Management APIs**

```
GET    /api/attendance/student/:id          # Get student attendance
GET    /api/attendance/course/:id           # Get course attendance
POST   /api/attendance                      # Mark attendance
PUT    /api/attendance/:id                  # Update attendance
GET    /api/attendance/class/:id/date       # Get daily attendance
GET    /api/teachers/:id/attendance         # Teacher's attendance overview
```

### **Fee Management APIs**

```
GET    /api/fees/student/:id               # Get student fees
POST   /api/fees                           # Create fee entry
PUT    /api/fees/:id                       # Update fee status
GET    /api/fees/pending                   # All pending fees
GET    /api/fees/overdue                   # Overdue fees
POST   /api/fees/:id/payment               # Record payment
```

### **Message System APIs**

```
GET    /api/messages/user/:id              # Get user's messages
POST   /api/messages                       # Send message
PUT    /api/messages/:id/read              # Mark as read
DELETE /api/messages/:id                   # Delete message
GET    /api/messages/unread/:id            # Get unread count
POST   /api/messages/:id/reply             # Reply to message
```

### **Class Management APIs**

```
GET    /api/classes                        # Get all classes
GET    /api/classes/:id                    # Get class details
POST   /api/classes                        # Create class
PUT    /api/classes/:id                    # Update class
GET    /api/classes/:id/students           # Get class students
GET    /api/teachers/:id/classes           # Teacher's classes
```

## 🔄 Frontend Service Updates Required

### 1. Update Student Service (`src/services/student.service.ts`)

```typescript
// Replace static data with API calls
getDashboardStats: async (studentId: string) => {
  const response = await api.get(`/students/${studentId}/dashboard`);
  return response.data;
},

getAssignments: async (studentId: string) => {
  const response = await api.get(`/students/${studentId}/assignments`);
  return response.data;
},

getGrades: async (studentId: string) => {
  const response = await api.get(`/grades/student/${studentId}`);
  return response.data;
},

getAttendance: async (studentId: string) => {
  const response = await api.get(`/attendance/student/${studentId}`);
  return response.data;
}
```

### 2. Update Teacher Service (`src/services/teacher.service.ts`)

```typescript
getDashboardStats: async (teacherId: string) => {
  const response = await api.get(`/teachers/${teacherId}/dashboard`);
  return response.data;
},

getClasses: async (teacherId: string) => {
  const response = await api.get(`/teachers/${teacherId}/classes`);
  return response.data;
},

getAssignments: async (teacherId: string) => {
  const response = await api.get(`/teachers/${teacherId}/assignments`);
  return response.data;
},

getPendingGrades: async (teacherId: string) => {
  const response = await api.get(`/teachers/${teacherId}/pending-grades`);
  return response.data;
}
```

### 3. Update Admin API (`src/lib/api.ts`)

```typescript
// Add missing admin endpoints
adminApi: {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getAllStudents: async () => {
    const response = await api.get('/admin/students');
    return response.data;
  },

  getAllTeachers: async () => {
    const response = await api.get('/admin/teachers');
    return response.data;
  },

  getSystemReports: async () => {
    const response = await api.get('/admin/reports');
    return response.data;
  }
}
```

## 📱 Pages That Need Live Data Updates

### Student Portal

- ✅ **Dashboard**: Course count, assignments due, average grade, attendance
- ✅ **Courses**: Enrolled courses, progress, materials
- ✅ **Assignments**: Pending/submitted assignments, grades
- ✅ **Grades**: Course-wise grades, GPA calculation
- ✅ **Attendance**: Daily attendance, percentage
- ✅ **Exams**: Upcoming exams, results
- ✅ **Fees**: Fee status, payment history
- ✅ **Messages**: Inbox, sent messages

### Teacher Portal

- ✅ **Dashboard**: Classes, students, pending grades
- ✅ **Classes**: Assigned classes, student lists
- ✅ **Students**: Student profiles, performance
- ✅ **Assignments**: Created assignments, submissions
- ✅ **Attendance**: Mark attendance, reports
- ✅ **Exams**: Schedule exams, grade results
- ✅ **Messages**: Communication with students/parents

### Admin Portal

- ✅ **Dashboard**: System overview, statistics
- ✅ **User Management**: All users, creation, editing
- ✅ **Students**: Student management, enrollment
- ✅ **Teachers**: Teacher management, assignments
- ✅ **Courses**: Course creation, management
- ✅ **Fees**: Fee management, payment tracking
- ✅ **Reports**: System reports, analytics

### Parent Portal

- ✅ **Dashboard**: Children overview, recent activities
- ✅ **Progress**: Child's academic progress
- ✅ **Attendance**: Child's attendance records
- ✅ **Fees**: Fee payment, history
- ✅ **Messages**: Communication with teachers

## 🚀 Implementation Priority

### Phase 1 (High Priority)

1. **User Management** - Already implemented ✅
2. **Dashboard Stats** - Replace hardcoded numbers
3. **Course Management** - Create/manage courses
4. **Student-Course Enrollment** - Link students to courses

### Phase 2 (Medium Priority)

5. **Assignment System** - Create, submit, grade assignments
6. **Basic Grade Management** - Record and view grades
7. **Simple Attendance** - Mark present/absent
8. **Fee Management** - Track payments

### Phase 3 (Low Priority)

9. **Advanced Messaging** - Full communication system
10. **Detailed Reports** - Analytics and insights
11. **Advanced Features** - Notifications, calendar integration

This roadmap will transform your school management system from static data to a fully functional, live system with real database integration!
