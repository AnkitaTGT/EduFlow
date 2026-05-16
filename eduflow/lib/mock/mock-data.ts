import { Student, Teacher, Course, Enrollment, Assignment, Quiz, QuizResult, Notification, AttendanceRecord } from "../types";

export const MOCK_USERS = [
  { uid: "admin1", name: "Admin User", email: "admin@eduflow.com", role: "admin", createdAt: new Date().toISOString() },
  { uid: "teacher1", name: "Sarah Connor", email: "teacher@eduflow.com", role: "teacher", createdAt: new Date().toISOString() },
  { uid: "student1", name: "John Doe", email: "student@eduflow.com", role: "student", createdAt: new Date().toISOString() },
];

export const MOCK_STUDENTS: Student[] = Array.from({ length: 400 }).map((_, i) => ({
  uid: `student_${i}`,
  name: `Student ${i + 1}`,
  email: `student${i}@school.edu`,
  role: "student",
  createdAt: new Date().toISOString(),
  classId: `class_${Math.floor(i / 30) + 1}`,
  batchId: "2024-A",
  joinDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  overallProgress: Math.floor(Math.random() * 100),
  attendancePct: Math.floor(Math.random() * 100),
  riskFlag: Math.random() > 0.8,
  riskReason: Math.random() > 0.8 ? "Low attendance" : undefined,
  enrolledCourseIds: ["course_1", "course_2"],
}));

MOCK_STUDENTS[0] = { ...MOCK_STUDENTS[0], uid: "student1", name: "John Doe", email: "student@eduflow.com" };

export const MOCK_COURSES: Course[] = [
  {
    id: "course_1",
    title: "Class 6-8 English Summer Prep",
    teacherId: "teacher1",
    teacherName: "Sarah Connor",
    totalLessons: 24,
    category: "English",
    enrolledCount: 150,
    completionRate: 65,
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "course_2",
    title: "Introduction to Algebra",
    teacherId: "teacher2",
    teacherName: "John Smith",
    totalLessons: 30,
    category: "Math",
    enrolledCount: 200,
    completionRate: 45,
    status: "active",
    createdAt: new Date().toISOString(),
  }
];

export const MOCK_QUIZZES: Quiz[] = [
  {
    id: "quiz_1",
    title: "Summer Reading Comprehension",
    courseId: "course_1",
    teacherId: "teacher1",
    avgScore: 78,
    passRate: 85,
    totalAttempts: 120,
    questions: [
      { id: "q1", text: "What is a noun?", options: ["Action", "Person, place, or thing", "Description", "Conjunction"], correctOptionIndex: 1 },
      { id: "q2", text: "Identify the verb: The quick brown fox jumps.", options: ["quick", "brown", "fox", "jumps"], correctOptionIndex: 3 }
    ]
  }
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
    {
        id: "att_1",
        studentId: "student1",
        courseId: "course_1",
        classId: "class_1",
        week: "2024-W20",
        presentDays: 4,
        totalDays: 5,
        pct: 80
    }
];

export const MOCK_ENROLLMENTS: Enrollment[] = [
    {
        id: "enr_1",
        studentId: "student1",
        courseId: "course_1",
        progress: 45,
        completedLessons: 10,
        startDate: new Date().toISOString(),
        lastActiveDate: new Date().toISOString(),
        status: "active"
    }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: "notif_1",
        targetUid: "student1",
        targetRole: "student",
        message: "New Quiz Available: Summer Reading",
        type: "info",
        date: new Date().toISOString(),
        read: false
    }
];
