# Database Seed Data for School Management System

This document contains sample data to populate your MongoDB collections, replacing all static frontend data with real database records.

## 🗄️ Database Collections with Sample Data

### 1. Users Collection

```javascript
// Users (Students, Teachers, Admins, Parents)
db.users.insertMany([
  // Students
  {
    _id: ObjectId('673b1a1234567890abcdef01'),
    uuid: '550e8400-e29b-41d4-a716-446655440001',
    userID: 'STD001',
    email: 'alex.johnson@school.com',
    firstName: 'Alex',
    lastName: 'Johnson',
    role: 'student',
    password: '$2b$12$hashedPasswordHere',
    phone: '+1234567890',
    address: {
      street: '123 Main Street',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      country: 'USA',
    },
    dob: '2005-03-15',
    gender: 'Male',
    bloodGroup: 'A+',
    profileImage: '/images/profiles/alex.jpg',
    classId: 'CLS10A',
    rollNumber: '2024001',
    isActive: true,
    parentId: '673b1a1234567890abcdef21',
    createdAt: new Date(),
    lastLogin: new Date(),
  },
  {
    _id: ObjectId('673b1a1234567890abcdef02'),
    uuid: '550e8400-e29b-41d4-a716-446655440002',
    userID: 'STD002',
    email: 'emma.davis@school.com',
    firstName: 'Emma',
    lastName: 'Davis',
    role: 'student',
    password: '$2b$12$hashedPasswordHere',
    phone: '+1234567891',
    address: {
      street: '456 Oak Avenue',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62702',
      country: 'USA',
    },
    dob: '2005-07-22',
    gender: 'Female',
    bloodGroup: 'B+',
    profileImage: '/images/profiles/emma.jpg',
    classId: 'CLS10A',
    rollNumber: '2024002',
    isActive: true,
    parentId: '673b1a1234567890abcdef22',
    createdAt: new Date(),
    lastLogin: new Date(),
  },

  // Teachers
  {
    _id: ObjectId('673b1a1234567890abcdef11'),
    uuid: '550e8400-e29b-41d4-a716-446655440011',
    userID: 'TCH001',
    email: 'sarah.wilson@school.com',
    firstName: 'Sarah',
    lastName: 'Wilson',
    role: 'teacher',
    password: '$2b$12$hashedPasswordHere',
    phone: '+1234567811',
    address: {
      street: '789 Pine Road',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62703',
      country: 'USA',
    },
    dob: '1985-11-10',
    gender: 'Female',
    bloodGroup: 'O+',
    profileImage: '/images/profiles/sarah.jpg',
    subject: 'Mathematics',
    qualification: 'M.Sc Mathematics',
    experience: 8,
    isActive: true,
    createdAt: new Date(),
    lastLogin: new Date(),
  },
  {
    _id: ObjectId('673b1a1234567890abcdef12'),
    uuid: '550e8400-e29b-41d4-a716-446655440012',
    userID: 'TCH002',
    email: 'michael.brown@school.com',
    firstName: 'Michael',
    lastName: 'Brown',
    role: 'teacher',
    password: '$2b$12$hashedPasswordHere',
    phone: '+1234567812',
    subject: 'Physics',
    qualification: 'M.Sc Physics',
    experience: 10,
    isActive: true,
    createdAt: new Date(),
    lastLogin: new Date(),
  },

  // Admin
  {
    _id: ObjectId('673b1a1234567890abcdef31'),
    uuid: '550e8400-e29b-41d4-a716-446655440031',
    userID: 'ADM001',
    email: 'admin@school.com',
    firstName: 'John',
    lastName: 'Smith',
    role: 'admin',
    password: '$2b$12$hashedPasswordHere',
    phone: '+1234567831',
    address: {
      street: '321 Admin Street',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704',
      country: 'USA',
    },
    isActive: true,
    createdAt: new Date(),
    lastLogin: new Date(),
  },

  // Parents
  {
    _id: ObjectId('673b1a1234567890abcdef21'),
    uuid: '550e8400-e29b-41d4-a716-446655440021',
    userID: 'PAR001',
    email: 'robert.johnson@email.com',
    firstName: 'Robert',
    lastName: 'Johnson',
    role: 'parent',
    password: '$2b$12$hashedPasswordHere',
    phone: '+1234567821',
    children: ['673b1a1234567890abcdef01'], // Alex Johnson
    occupation: 'Engineer',
    isActive: true,
    createdAt: new Date(),
    lastLogin: new Date(),
  },
]);
```

### 2. Classes Collection

```javascript
db.classes.insertMany([
  {
    _id: ObjectId('673b2a1234567890abcdef01'),
    classId: 'CLS10A',
    className: 'Grade 10 - Section A',
    grade: '10',
    section: 'A',
    classTeacherId: '673b1a1234567890abcdef11', // Sarah Wilson
    students: [
      '673b1a1234567890abcdef01', // Alex Johnson
      '673b1a1234567890abcdef02', // Emma Davis
    ],
    maxStudents: 30,
    room: 'Room 101',
    academicYear: '2024-2025',
    isActive: true,
    createdAt: new Date(),
  },
  {
    _id: ObjectId('673b2a1234567890abcdef02'),
    classId: 'CLS10B',
    className: 'Grade 10 - Section B',
    grade: '10',
    section: 'B',
    classTeacherId: '673b1a1234567890abcdef12', // Michael Brown
    students: [],
    maxStudents: 30,
    room: 'Room 102',
    academicYear: '2024-2025',
    isActive: true,
    createdAt: new Date(),
  },
]);
```

### 3. Courses Collection

```javascript
db.courses.insertMany([
  {
    _id: ObjectId('673b3a1234567890abcdef01'),
    courseId: 'MATH101',
    name: 'Mathematics',
    description: 'Advanced Mathematics for Grade 10',
    teacherId: '673b1a1234567890abcdef11',
    teacherName: 'Sarah Wilson',
    classId: 'CLS10A',
    semester: 'Fall 2024',
    credits: 4,
    schedule: {
      days: ['Monday', 'Wednesday', 'Friday'],
      time: '09:00 AM - 10:30 AM',
      room: 'Math Lab 1',
    },
    students: ['673b1a1234567890abcdef01', '673b1a1234567890abcdef02'],
    maxStudents: 30,
    startDate: new Date('2024-08-15'),
    endDate: new Date('2024-12-15'),
    isActive: true,
    createdAt: new Date(),
  },
  {
    _id: ObjectId('673b3a1234567890abcdef02'),
    courseId: 'PHY101',
    name: 'Physics',
    description: 'Fundamentals of Physics',
    teacherId: '673b1a1234567890abcdef12',
    teacherName: 'Michael Brown',
    classId: 'CLS10A',
    semester: 'Fall 2024',
    credits: 4,
    schedule: {
      days: ['Tuesday', 'Thursday'],
      time: '10:00 AM - 11:30 AM',
      room: 'Physics Lab',
    },
    students: ['673b1a1234567890abcdef01', '673b1a1234567890abcdef02'],
    maxStudents: 25,
    isActive: true,
    createdAt: new Date(),
  },
  {
    _id: ObjectId('673b3a1234567890abcdef03'),
    courseId: 'CHEM101',
    name: 'Chemistry',
    description: 'Organic and Inorganic Chemistry',
    teacherId: '673b1a1234567890abcdef11',
    teacherName: 'Sarah Wilson',
    classId: 'CLS10A',
    semester: 'Fall 2024',
    credits: 4,
    schedule: {
      days: ['Monday', 'Thursday'],
      time: '02:00 PM - 03:30 PM',
      room: 'Chemistry Lab',
    },
    students: ['673b1a1234567890abcdef01', '673b1a1234567890abcdef02'],
    isActive: true,
    createdAt: new Date(),
  },
]);
```

### 4. Assignments Collection

```javascript
db.assignments.insertMany([
  {
    _id: ObjectId('673b4a1234567890abcdef01'),
    assignmentId: 'ASG001',
    title: 'Linear Algebra Quiz',
    description: 'Solve linear equation systems and matrix operations',
    courseId: '673b3a1234567890abcdef01',
    courseName: 'Mathematics',
    teacherId: '673b1a1234567890abcdef11',
    dueDate: new Date('2024-11-26'),
    maxScore: 100,
    type: 'quiz',
    instructions:
      'Complete all 10 questions. Show your work for partial credit.',
    attachments: ['/files/assignments/linear_algebra_questions.pdf'],
    isActive: true,
    createdAt: new Date('2024-11-10'),
  },
  {
    _id: ObjectId('673b4a1234567890abcdef02'),
    assignmentId: 'ASG002',
    title: 'Molecular Structure',
    description: 'Draw molecular structures for given compounds',
    courseId: '673b3a1234567890abcdef03',
    courseName: 'Chemistry',
    teacherId: '673b1a1234567890abcdef11',
    dueDate: new Date('2024-11-25'),
    maxScore: 50,
    type: 'assignment',
    instructions: 'Draw Lewis structures and identify molecular geometry',
    isActive: true,
    createdAt: new Date('2024-11-08'),
  },
  {
    _id: ObjectId('673b4a1234567890abcdef03'),
    assignmentId: 'ASG003',
    title: 'Physics Lab Report',
    description: 'Pendulum motion experiment analysis',
    courseId: '673b3a1234567890abcdef02',
    courseName: 'Physics',
    teacherId: '673b1a1234567890abcdef12',
    dueDate: new Date('2024-11-28'),
    maxScore: 75,
    type: 'project',
    instructions: 'Submit lab report with data analysis and conclusions',
    isActive: true,
    createdAt: new Date('2024-11-12'),
  },
]);
```

### 5. Submissions Collection

```javascript
db.submissions.insertMany([
  {
    _id: ObjectId('673b5a1234567890abcdef01'),
    assignmentId: '673b4a1234567890abcdef02', // Molecular Structure
    studentId: '673b1a1234567890abcdef01', // Alex Johnson
    studentName: 'Alex Johnson',
    submissionDate: new Date('2024-11-24'),
    files: ['/uploads/submissions/alex_molecular_structure.pdf'],
    comments: 'Completed all molecular drawings as requested',
    status: 'submitted',
    grade: 45,
    feedback:
      'Excellent work! Clear diagrams and correct geometry identification.',
    gradedBy: '673b1a1234567890abcdef11',
    gradedAt: new Date('2024-11-25'),
  },
  {
    _id: ObjectId('673b5a1234567890abcdef02'),
    assignmentId: '673b4a1234567890abcdef01', // Linear Algebra Quiz
    studentId: '673b1a1234567890abcdef01', // Alex Johnson
    studentName: 'Alex Johnson',
    submissionDate: null,
    files: [],
    comments: '',
    status: 'pending',
    grade: null,
    feedback: '',
    gradedBy: null,
    gradedAt: null,
  },
]);
```

### 6. Exams Collection

```javascript
db.exams.insertMany([
  {
    _id: ObjectId('673b6a1234567890abcdef01'),
    examId: 'EXM001',
    title: 'Mathematics Midterm',
    courseId: '673b3a1234567890abcdef01',
    courseName: 'Mathematics',
    teacherId: '673b1a1234567890abcdef11',
    examDate: new Date('2024-12-15'),
    duration: 120, // minutes
    maxScore: 100,
    type: 'midterm',
    room: 'Exam Hall A',
    instructions: 'Bring calculator and geometry set',
    isActive: true,
    createdAt: new Date(),
  },
  {
    _id: ObjectId('673b6a1234567890abcdef02'),
    examId: 'EXM002',
    title: 'Physics Final Exam',
    courseId: '673b3a1234567890abcdef02',
    courseName: 'Physics',
    teacherId: '673b1a1234567890abcdef12',
    examDate: new Date('2024-12-20'),
    duration: 180,
    maxScore: 100,
    type: 'final',
    room: 'Exam Hall B',
    instructions: 'Formula sheet provided. No calculators allowed.',
    isActive: true,
    createdAt: new Date(),
  },
]);
```

### 7. Grades Collection

```javascript
db.grades.insertMany([
  // Assignment Grades
  {
    _id: ObjectId('673b7a1234567890abcdef01'),
    studentId: '673b1a1234567890abcdef01', // Alex Johnson
    courseId: '673b3a1234567890abcdef03', // Chemistry
    assignmentId: '673b4a1234567890abcdef02', // Molecular Structure
    type: 'assignment',
    score: 45,
    maxScore: 50,
    percentage: 90,
    grade: 'A-',
    feedback: 'Excellent molecular diagrams',
    gradedBy: '673b1a1234567890abcdef11',
    gradedAt: new Date('2024-11-25'),
    semester: 'Fall 2024',
  },
  {
    _id: ObjectId('673b7a1234567890abcdef02'),
    studentId: '673b1a1234567890abcdef02', // Emma Davis
    courseId: '673b3a1234567890abcdef01', // Mathematics
    type: 'assignment',
    score: 85,
    maxScore: 100,
    percentage: 85,
    grade: 'B+',
    feedback: 'Good understanding, minor calculation errors',
    gradedBy: '673b1a1234567890abcdef11',
    gradedAt: new Date('2024-11-20'),
    semester: 'Fall 2024',
  },
  // Test Grades
  {
    _id: ObjectId('673b7a1234567890abcdef03'),
    studentId: '673b1a1234567890abcdef01', // Alex Johnson
    courseId: '673b3a1234567890abcdef01', // Mathematics
    examId: '673b6a1234567890abcdef01',
    type: 'exam',
    score: 82,
    maxScore: 100,
    percentage: 82,
    grade: 'B+',
    feedback: 'Strong performance in algebra section',
    gradedBy: '673b1a1234567890abcdef11',
    gradedAt: new Date('2024-11-18'),
    semester: 'Fall 2024',
  },
]);
```

### 8. Attendance Collection

```javascript
db.attendance.insertMany([
  // Alex Johnson's Attendance
  {
    _id: ObjectId('673b8a1234567890abcdef01'),
    studentId: '673b1a1234567890abcdef01',
    courseId: '673b3a1234567890abcdef01', // Mathematics
    date: new Date('2024-11-11'),
    status: 'present',
    markedBy: '673b1a1234567890abcdef11',
    notes: '',
    createdAt: new Date('2024-11-11'),
  },
  {
    _id: ObjectId('673b8a1234567890abcdef02'),
    studentId: '673b1a1234567890abcdef01',
    courseId: '673b3a1234567890abcdef01', // Mathematics
    date: new Date('2024-11-13'),
    status: 'present',
    markedBy: '673b1a1234567890abcdef11',
    notes: '',
    createdAt: new Date('2024-11-13'),
  },
  {
    _id: ObjectId('673b8a1234567890abcdef03'),
    studentId: '673b1a1234567890abcdef01',
    courseId: '673b3a1234567890abcdef02', // Physics
    date: new Date('2024-11-12'),
    status: 'absent',
    markedBy: '673b1a1234567890abcdef12',
    notes: 'Sick leave',
    createdAt: new Date('2024-11-12'),
  },
  // Emma Davis's Attendance
  {
    _id: ObjectId('673b8a1234567890abcdef04'),
    studentId: '673b1a1234567890abcdef02',
    courseId: '673b3a1234567890abcdef01', // Mathematics
    date: new Date('2024-11-11'),
    status: 'present',
    markedBy: '673b1a1234567890abcdef11',
    createdAt: new Date('2024-11-11'),
  },
]);
```

### 9. Fees Collection

```javascript
db.fees.insertMany([
  // Alex Johnson's Fees
  {
    _id: ObjectId('673b9a1234567890abcdef01'),
    studentId: '673b1a1234567890abcdef01',
    feeType: 'tuition',
    amount: 5000,
    dueDate: new Date('2024-12-01'),
    paidDate: new Date('2024-11-15'),
    status: 'paid',
    semester: 'Fall 2024',
    paymentMethod: 'bank_transfer',
    receiptNumber: 'RCP001',
    notes: 'Semester tuition fee',
  },
  {
    _id: ObjectId('673b9a1234567890abcdef02'),
    studentId: '673b1a1234567890abcdef01',
    feeType: 'lab',
    amount: 500,
    dueDate: new Date('2024-11-30'),
    paidDate: null,
    status: 'pending',
    semester: 'Fall 2024',
    paymentMethod: null,
    receiptNumber: null,
    notes: 'Chemistry lab fee',
  },
  // Emma Davis's Fees
  {
    _id: ObjectId('673b9a1234567890abcdef03'),
    studentId: '673b1a1234567890abcdef02',
    feeType: 'tuition',
    amount: 5000,
    dueDate: new Date('2024-12-01'),
    paidDate: null,
    status: 'overdue',
    semester: 'Fall 2024',
    paymentMethod: null,
    receiptNumber: null,
    notes: 'Semester tuition fee - overdue',
  },
]);
```

### 10. Messages Collection

```javascript
db.messages.insertMany([
  {
    _id: ObjectId('673baa1234567890abcdef01'),
    senderId: '673b1a1234567890abcdef11', // Sarah Wilson (Teacher)
    receiverId: '673b1a1234567890abcdef01', // Alex Johnson (Student)
    senderName: 'Sarah Wilson',
    senderRole: 'teacher',
    subject: 'Assignment Reminder',
    message:
      'Hi Alex, this is a reminder that your Linear Algebra Quiz is due tomorrow. Please make sure to submit it on time.',
    isRead: false,
    attachments: [],
    parentMessageId: null,
    createdAt: new Date('2024-11-24'),
  },
  {
    _id: ObjectId('673baa1234567890abcdef02'),
    senderId: '673b1a1234567890abcdef01', // Alex Johnson (Student)
    receiverId: '673b1a1234567890abcdef11', // Sarah Wilson (Teacher)
    senderName: 'Alex Johnson',
    senderRole: 'student',
    subject: 'Question about Physics Lab',
    message:
      'Dear Mrs. Wilson, I have a question about the pendulum experiment. Could you clarify the measurement requirements?',
    isRead: true,
    attachments: [],
    parentMessageId: null,
    createdAt: new Date('2024-11-23'),
  },
  {
    _id: ObjectId('673baa1234567890abcdef03'),
    senderId: '673b1a1234567890abcdef31', // Admin
    receiverId: '673b1a1234567890abcdef21', // Parent
    senderName: 'John Smith',
    senderRole: 'admin',
    subject: 'Fee Payment Reminder',
    message:
      'Dear Mr. Johnson, this is to remind you that the tuition fee for Alex Johnson is due on December 1st. Please make the payment at your earliest convenience.',
    isRead: false,
    attachments: [],
    parentMessageId: null,
    createdAt: new Date('2024-11-20'),
  },
]);
```

## 🎯 MongoDB Commands to Insert Data

Create a file called `seed-data.js` and run it with MongoDB:

```javascript
// seed-data.js
use school_management_db;

// Drop existing collections (optional - use with caution in production)
db.users.drop();
db.classes.drop();
db.courses.drop();
db.assignments.drop();
db.submissions.drop();
db.exams.drop();
db.grades.drop();
db.attendance.drop();
db.fees.drop();
db.messages.drop();

// Insert all the data above
// (Copy all the insertMany commands from above)

print("✅ Database seeded successfully!");
print("📊 Collections created:");
print("- Users: " + db.users.count() + " documents");
print("- Classes: " + db.classes.count() + " documents");
print("- Courses: " + db.courses.count() + " documents");
print("- Assignments: " + db.assignments.count() + " documents");
print("- Submissions: " + db.submissions.count() + " documents");
print("- Exams: " + db.exams.count() + " documents");
print("- Grades: " + db.grades.count() + " documents");
print("- Attendance: " + db.attendance.count() + " documents");
print("- Fees: " + db.fees.count() + " documents");
print("- Messages: " + db.messages.count() + " documents");
```

Run with: `mongo seed-data.js`

## 🔗 How This Replaces Frontend Static Data

**Student Dashboard (Alex Johnson):**

- Courses Enrolled: `3` (Math, Physics, Chemistry)
- Assignments Due: `2` (Linear Algebra Quiz, Physics Lab Report)
- Average Grade: `85%` (calculated from actual grades)
- Attendance: `85%` (2 present out of 3 total classes)

**Teacher Dashboard (Sarah Wilson):**

- Active Classes: `2` (Math, Chemistry)
- Total Students: `2` (Alex, Emma)
- Assignments to Grade: `1` (Linear Algebra Quiz pending)
- Today's Attendance: Real attendance data

**Admin Dashboard:**

- Total Students: `2`
- Total Teachers: `2`
- Total Revenue: `$5,500` (from fee payments)
- Recent Activities: Real message and grade data

This seed data will make your frontend completely dynamic with real database information!
