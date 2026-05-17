export type UserRole = "admin" | "teacher" | "student";

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface Student extends User {
  classId: string;
  batchId: string;
  joinDate: string;
  overallProgress: number;
  attendancePct: number;
  riskFlag: boolean;
  riskReason?: string;
  enrolledCourseIds: string[];
}

export interface Teacher extends User {
  assignedCourseIds: string[];
  assignedClassIds: string[];
}

export interface Course {
  id: string;
  title: string;
  teacherId: string;
  teacherName: string;
  totalLessons: number;
  category: string;
  enrolledCount: number;
  completionRate: number;
  status: "active" | "archived" | "draft";
  createdAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  progress: number;
  completedLessons: number;
  startDate: string;
  lastActiveDate: string;
  status: "active" | "completed" | "dropped";
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  courseId: string;
  classId: string;
  week: string;
  presentDays: number;
  totalDays: number;
  pct: number;
}

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  teacherId: string;
  dueDate: string;
  totalStudents: number;
  submittedCount: number;
  pendingCount: number;
  gradedCount: number;
}

export interface Submission {
  id: string;
  studentId: string;
  assignmentId: string;
  courseId: string;
  submittedAt: string;
  status: "submitted" | "pending" | "graded";
  score?: number;
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  teacherId: string;
  avgScore: number;
  passRate: number;
  totalAttempts: number;
  questions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
}

export interface QuizResult {
  id: string;
  studentId: string;
  quizId: string;
  courseId: string;
  score: number;
  passed: boolean;
  attemptDate: string;
}

export interface Notification {
  id: string;
  targetUid: string;
  targetRole: UserRole | "all";
  message: string;
  type: "info" | "warning" | "success" | "error";
  date: string;
  read: boolean;
}
