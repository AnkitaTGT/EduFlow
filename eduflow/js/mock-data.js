// FIREBASE REPLACEMENT: swap window.EduFlowData assignments with
// Firestore collection reads. All downstream JS reads from this
// object — no other file talks to data directly.

const MOCK_DATA = (() => {
  // Helpers
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randomItem = (arr) => arr[randomInt(0, arr.length - 1)];
  const generateId = (prefix, i) => `${prefix}${String(i).padStart(4, '0')}`;

  // Names
  const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Riaan", "Krishna", "Ishaan", "Shaurya", "Aadhya", "Diya", "Kashvi", "Saanvi", "Myra", "Ananya", "Aarohi", "Navya", "Riya", "Fatima", "Rahul", "Priya", "Amit", "Sneha", "Karan", "Neha", "Vikram", "Pooja", "Sanjay", "Kavya", "Mohammad", "Ayesha"];
  const lastNames = ["Sharma", "Patel", "Singh", "Kumar", "Das", "Verma", "Rao", "Gupta", "Mishra", "Reddy", "Jain", "Mehta", "Bose", "Chauhan", "Khan", "Iyer", "Garg", "Kapoor", "Nair", "Yadav", "Pandey"];

  // Generate 15 Courses
  const categories = ["Math", "Science", "English", "SST", "Coding"];
  const courseTitles = [
    "Algebra Fundamentals", "Geometry Mastery", "Calculus I",
    "Physics: Mechanics", "Chemistry: Organic", "Biology: Genetics",
    "English Literature", "Grammar & Composition",
    "World History", "Geography of India", "Civics & Economics",
    "Python for Beginners", "Web Development basics", "Data Structures in C++", "Machine Learning Intro"
  ];

  const courses = Array.from({ length: 15 }).map((_, i) => ({
    id: `C${String(i+1).padStart(3, '0')}`,
    title: courseTitles[i],
    teacherId: `T${String((i % 20) + 1).padStart(3, '0')}`,
    totalLessons: randomInt(15, 30),
    enrolledCount: 0, // will compute later
    completionRate: 0, // will compute
    category: randomItem(categories),
    status: "Active"
  }));

  // Generate 20 Teachers
  const teachers = Array.from({ length: 20 }).map((_, i) => {
    const name = `${randomItem(firstNames)} ${randomItem(lastNames)}`;
    return {
      id: `T${String(i+1).padStart(3, '0')}`,
      name: name,
      email: name.toLowerCase().replace(' ', '.') + "@eduflow.com",
      assignedCourses: courses.filter(c => c.teacherId === `T${String(i+1).padStart(3, '0')}`).map(c => c.id),
      assignedClasses: ["Class 10A", "Class 10B", "Class 11A", "Class 12A"].filter(() => Math.random() > 0.5)
    };
  });

  // Generate 400 Students
  const classes = ["Class 10A", "Class 10B", "Class 11A", "Class 11B", "Class 12A", "Class 12B"];
  const students = Array.from({ length: 400 }).map((_, i) => {
    const name = `${randomItem(firstNames)} ${randomItem(lastNames)}`;
    const joinDate = new Date();
    joinDate.setMonth(joinDate.getMonth() - randomInt(1, 12));
    joinDate.setDate(joinDate.getDate() - randomInt(1, 28));

    const enrolledCoursesCount = randomInt(2, 5);
    const enrolledCourseIds = [];
    while(enrolledCourseIds.length < enrolledCoursesCount) {
      const c = randomItem(courses).id;
      if (!enrolledCourseIds.includes(c)) enrolledCourseIds.push(c);
    }

    return {
      id: `S${String(i+1).padStart(4, '0')}`,
      name: name,
      email: name.toLowerCase().replace(' ', '.') + "@student.eduflow.com",
      classId: randomItem(classes),
      enrolledCourses: enrolledCourseIds,
      attendancePct: 0, // calc
      overallProgress: 0, // calc
      riskFlag: false, // calc
      joinDate: joinDate.toISOString().split('T')[0]
    };
  });

  // Enrollments
  const enrollments = [];
  students.forEach(s => {
    s.enrolledCourses.forEach(cid => {
      const course = courses.find(c => c.id === cid);
      const progress = randomInt(10, 100);
      const completedLessons = Math.floor((progress / 100) * course.totalLessons);

      enrollments.push({
        studentId: s.id,
        courseId: cid,
        progress: progress,
        completedLessons: completedLessons,
        startDate: s.joinDate,
        status: progress === 100 ? "Completed" : "Active"
      });
    });
  });

  // Update Courses stats based on enrollments
  courses.forEach(c => {
    const courseEnrollments = enrollments.filter(e => e.courseId === c.id);
    c.enrolledCount = courseEnrollments.length;
    if (courseEnrollments.length > 0) {
      const avgProg = courseEnrollments.reduce((acc, e) => acc + e.progress, 0) / courseEnrollments.length;
      c.completionRate = Math.round(avgProg);
    }
  });

  // Attendance (Last 8 weeks)
  const attendance = [];
  const today = new Date();
  students.forEach(s => {
    let totalP = 0;
    let totalD = 0;
    s.enrolledCourses.forEach(cid => {
      for (let w = 1; w <= 8; w++) {
        const totalDays = 5;
        const presentDays = Math.random() > 0.1 ? randomInt(3, 5) : randomInt(0, 3);
        totalP += presentDays;
        totalD += totalDays;
        attendance.push({
          studentId: s.id,
          courseId: cid,
          week: `Week ${w}`,
          presentDays: presentDays,
          totalDays: totalDays
        });
      }
    });
    s.attendancePct = Math.round((totalP / totalD) * 100);

    // Overall Progress
    const stuEnrollments = enrollments.filter(e => e.studentId === s.id);
    if(stuEnrollments.length > 0) {
        s.overallProgress = Math.round(stuEnrollments.reduce((sum, e) => sum + e.progress, 0) / stuEnrollments.length);
    } else {
        s.overallProgress = 0;
    }

    // Risk Flag
    s.riskFlag = s.attendancePct < 60 || s.overallProgress < 30;
  });

  // Assignments
  const assignments = [];
  courses.forEach((c) => {
    for(let i=0; i<2; i++) { // 2 assignments per course
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + randomInt(-10, 10)); // Some past, some future

      assignments.push({
        id: `A-${c.id}-${i+1}`,
        title: `Assignment ${i+1}: ${c.category} Project`,
        courseId: c.id,
        dueDate: dueDate.toISOString().split('T')[0],
        totalSubmissions: 0,
        pending: 0,
        graded: 0
      });
    }
  });

  // Assignment Submissions
  const submissions = [];
  assignments.forEach(a => {
    const courseEnrollments = enrollments.filter(e => e.courseId === a.courseId);
    let subs = 0;
    let pend = 0;
    let grad = 0;
    const isPast = new Date(a.dueDate) < new Date();

    courseEnrollments.forEach(ce => {
      const isSubmitted = isPast ? Math.random() > 0.2 : Math.random() > 0.7;
      const status = isSubmitted ? (Math.random() > 0.3 ? "Graded" : "Submitted") : (isPast ? "Late" : "Pending");

      if(isSubmitted) subs++;
      if(status === "Pending" || status === "Late") pend++;
      if(status === "Graded") grad++;

      submissions.push({
        studentId: ce.studentId,
        assignmentId: a.id,
        submittedOn: isSubmitted ? a.dueDate : null,
        status: status,
        score: status === "Graded" ? randomInt(50, 100) : null
      });
    });
    a.totalSubmissions = subs;
    a.pending = pend;
    a.graded = grad;
  });

  // Quizzes
  const quizzes = [];
  courses.forEach((c) => {
    for(let i=0; i<2; i++) { // 2 quizzes per course
      quizzes.push({
        id: `Q-${c.id}-${i+1}`,
        title: `Quiz ${i+1}: Mid-term ${c.category}`,
        courseId: c.id,
        avgScore: 0,
        passRate: 0,
        totalAttempts: 0
      });
    }
  });

  // Quiz Results
  const quizResults = [];
  quizzes.forEach(q => {
    const courseEnrollments = enrollments.filter(e => e.courseId === q.courseId);
    let totalScore = 0;
    let passCount = 0;
    let attempts = 0;

    courseEnrollments.forEach(ce => {
      if(Math.random() > 0.1) { // 90% attempted
        const score = randomInt(30, 100);
        const passed = score >= 50;
        totalScore += score;
        if(passed) passCount++;
        attempts++;

        const attemptDate = new Date();
        attemptDate.setDate(attemptDate.getDate() - randomInt(1, 30));

        quizResults.push({
          studentId: ce.studentId,
          quizId: q.id,
          score: score,
          passed: passed,
          attemptDate: attemptDate.toISOString().split('T')[0]
        });
      }
    });

    if(attempts > 0) {
      q.avgScore = Math.round(totalScore / attempts);
      q.passRate = Math.round((passCount / attempts) * 100);
    }
    q.totalAttempts = attempts;
  });

  // Notifications
  const notifications = [
    { id: "N1", targetRole: "Admin", message: "System backup completed successfully.", type: "Info", date: new Date().toISOString(), read: false },
    { id: "N2", targetRole: "Teacher", message: "Grades for Assignment 1 are due tomorrow.", type: "Warning", date: new Date().toISOString(), read: false },
    { id: "N3", targetRole: "Student", message: "New course 'Python for Beginners' available.", type: "Info", date: new Date().toISOString(), read: false },
    { id: "N4", targetRole: "Admin", message: "5 students flagged as At-Risk this week.", type: "Danger", date: new Date().toISOString(), read: false }
  ];

  return {
    students,
    teachers,
    courses,
    enrollments,
    attendance,
    assignments,
    submissions,
    quizzes,
    quizResults,
    notifications
  };
})();

// Store in global window object
window.EduFlowData = MOCK_DATA;

// Caching logic: If not in sessionStorage, copy it. Otherwise read from sessionStorage.
// "Replace sessionStorage cache with Firestore real-time listener"
if (!sessionStorage.getItem('eduflow_data')) {
  sessionStorage.setItem('eduflow_data', JSON.stringify(window.EduFlowData));
} else {
  // Read back to ensure we use modified state if any (e.g. adding a course)
  window.EduFlowData = JSON.parse(sessionStorage.getItem('eduflow_data'));
}
