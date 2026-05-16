// views.js

export const views = {
    students: {
        html: `
            <div class="card" style="margin-bottom: 20px;">
                <div class="card-header">
                    <h3 class="card-title">Students Directory</h3>
                    <button class="btn btn-primary" onclick="alert('Demo: Add Student modal would open here.')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg> Add Student
                    </button>
                </div>

                <div class="filters-bar">
                    <div class="input-group">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" id="search-student" placeholder="Search students...">
                    </div>
                    <div class="input-group">
                        <select id="filter-class">
                            <option value="">All Classes</option>
                            <option value="Class 10A">Class 10A</option>
                            <option value="Class 10B">Class 10B</option>
                            <option value="Class 11A">Class 11A</option>
                            <option value="Class 11B">Class 11B</option>
                            <option value="Class 12A">Class 12A</option>
                            <option value="Class 12B">Class 12B</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <select id="filter-risk">
                            <option value="">All Status</option>
                            <option value="true">At Risk</option>
                            <option value="false">On Track</option>
                        </select>
                    </div>
                </div>

                <div class="table-container" id="students-table-container"></div>
            </div>

            <div class="side-drawer" id="student-drawer">
                <div class="drawer-header">
                    <h3 id="drawer-student-name">Student Details</h3>
                    <button class="drawer-close" onclick="window.closeDrawer('student-drawer')">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div class="drawer-content" id="drawer-content"></div>
            </div>
        `,
        init: (data, teacherId = null) => {
            const columns = [
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Name' },
                { key: 'classId', label: 'Class' },
                { key: 'overallProgress', label: 'Progress', render: (val) => `${val}%` },
                { key: 'attendancePct', label: 'Attendance', render: (val) => `${val}%` },
                { key: 'riskFlag', label: 'Status', render: (val) => window.getRiskBadge(val) }
            ];

            const tableContainer = document.getElementById('students-table-container');
            if(!tableContainer) return;
            const table = new window.VirtualTable('students-table-container', columns, 48);

            table.onRowClick = (student) => {
                document.getElementById('drawer-student-name').textContent = student.name;
                const content = document.getElementById('drawer-content');

                const coursesHtml = student.enrolledCourses.map(cid => {
                    const c = data.courses.find(co => co.id === cid);
                    const e = data.enrollments.find(en => en.studentId === student.id && en.courseId === cid);
                    return c && e ? `
                        <div style="border: 1px solid var(--border); padding: 12px; border-radius: 6px; margin-bottom: 8px;">
                            <strong>${c.title}</strong>
                            <div style="margin-top: 8px;">
                                ${window.getProgressBar(e.progress)}
                                <small>${e.status}</small>
                            </div>
                        </div>
                    ` : '';
                }).join('');

                content.innerHTML = `
                    <div style="margin-bottom: 20px;">
                        <p><strong>ID:</strong> ${student.id}</p>
                        <p><strong>Email:</strong> ${student.email}</p>
                        <p><strong>Class:</strong> ${student.classId}</p>
                        <p><strong>Joined:</strong> ${student.joinDate}</p>
                    </div>
                    <h4>Enrolled Courses</h4>
                    <div style="margin-top: 10px;">${coursesHtml || '<p>No courses enrolled.</p>'}</div>
                `;
                window.openDrawer('student-drawer');
            };

            let studentsData = data.students;
            if (teacherId) {
                // Filter by teacher's classes/courses
                const myCourses = data.courses.filter(c => c.teacherId === teacherId).map(c => c.id);
                const myStudents = new Set(data.enrollments.filter(e => myCourses.includes(e.courseId)).map(e => e.studentId));
                studentsData = studentsData.filter(s => myStudents.has(s.id));
            }

            table.setData(studentsData);

            const applyFilters = () => {
                const search = document.getElementById('search-student').value.toLowerCase();
                const cls = document.getElementById('filter-class').value;
                const risk = document.getElementById('filter-risk').value;

                table.setFilter(s => {
                    const matchSearch = s.name.toLowerCase().includes(search) || s.id.toLowerCase().includes(search);
                    const matchCls = cls ? s.classId === cls : true;
                    const matchRisk = risk ? String(s.riskFlag) === risk : true;
                    return matchSearch && matchCls && matchRisk;
                });
            };

            document.getElementById('search-student').addEventListener('input', window.debounce(applyFilters, 300));
            document.getElementById('filter-class').addEventListener('change', applyFilters);
            document.getElementById('filter-risk').addEventListener('change', applyFilters);
        }
    },
    courses: {
        html: `
            <div class="card-header" style="margin-bottom: 20px;">
                <h3 class="card-title">Course Management</h3>
                <button class="btn btn-primary" onclick="alert('Demo: Add Course modal')">Add Course</button>
            </div>
            <div class="grid-cards" id="courses-grid"></div>
        `,
        init: (data, teacherId = null) => {
            const grid = document.getElementById('courses-grid');
            grid.innerHTML = '';

            let coursesData = data.courses;
            if (teacherId) {
                coursesData = coursesData.filter(c => c.teacherId === teacherId);
            }

            coursesData.forEach(course => {
                const teacher = data.teachers.find(t => t.id === course.teacherId);
                grid.innerHTML += `
                    <div class="card clickable-row" onclick="alert('Demo: Opening details for ${course.title}')">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                            <span class="badge badge-info">${course.category}</span>
                            ${window.getStatusBadge(course.status)}
                        </div>
                        <h4 style="margin-bottom: 8px;">${course.title}</h4>
                        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 16px;">
                            Teacher: ${teacher ? teacher.name : 'Unassigned'}
                        </p>
                        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted);">
                            <span>Enrolled: <strong>${course.enrolledCount}</strong></span>
                            <span>Completion: <strong>${course.completionRate}%</strong></span>
                        </div>
                        <div style="margin-top: 8px;">
                            ${window.getProgressBar(course.completionRate)}
                        </div>
                    </div>
                `;
            });
        }
    },
    analytics: {
        html: `
            <div class="card-header" style="margin-bottom: 20px;">
                <h3 class="card-title">School Analytics</h3>
                <button class="btn btn-outline" onclick="window.exportData()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Export CSV
                </button>
            </div>
            <div class="grid-2-cols" style="margin-bottom: 24px;">
                <div class="card">
                    <div class="card-header"><h3 class="card-title">Attendance Trends (Last 8 Weeks)</h3></div>
                    <div style="height: 300px;"><canvas id="analytics-attendance"></canvas></div>
                </div>
                <div class="card">
                    <div class="card-header"><h3 class="card-title">Quiz Performance by Category</h3></div>
                    <div style="height: 300px;"><canvas id="analytics-quizzes"></canvas></div>
                </div>
            </div>
            <div class="card">
                <div class="card-header"><h3 class="card-title">Cohort Comparison (Completion Rates)</h3></div>
                <div style="height: 300px;"><canvas id="analytics-cohorts"></canvas></div>
            </div>
        `,
        init: (data) => {
            const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'];
            const attData = weeks.map(w => {
                const records = data.attendance.filter(a => a.week === w);
                if(records.length === 0) return 0;
                const totalP = records.reduce((sum, r) => sum + r.presentDays, 0);
                const totalD = records.reduce((sum, r) => sum + r.totalDays, 0);
                return Math.round((totalP / totalD) * 100);
            });

            window.createLineChart('analytics-attendance', weeks, [{
                label: 'School Avg Attendance %',
                data: attData,
                borderColor: '#4F46E5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                fill: true,
                tension: 0.4
            }], 'Attendance %');

            const categories = [...new Set(data.courses.map(c => c.category))];
            const catData = categories.map(cat => {
                const courseIds = data.courses.filter(c => c.category === cat).map(c => c.id);
                const catQuizzes = data.quizzes.filter(q => courseIds.includes(q.courseId));
                if(catQuizzes.length === 0) return 0;
                return Math.round(catQuizzes.reduce((sum, q) => sum + q.avgScore, 0) / catQuizzes.length);
            });
            window.createBarChart('analytics-quizzes', categories, catData, 'Avg Quiz Score', '#10B981');

            const classes = [...new Set(data.students.map(s => s.classId))].sort();
            const clsData = classes.map(cls => {
                const students = data.students.filter(s => s.classId === cls);
                if(students.length === 0) return 0;
                return Math.round(students.reduce((sum, s) => sum + s.overallProgress, 0) / students.length);
            });
            window.createBarChart('analytics-cohorts', classes, clsData, 'Avg Progress %', '#F59E0B');

            window.exportData = function() {
                let csv = 'ID,Name,Class,Progress,Attendance,Risk\n';
                data.students.forEach(s => {
                    csv += `${s.id},"${s.name}",${s.classId},${s.overallProgress},${s.attendancePct},${s.riskFlag}\n`;
                });
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.setAttribute('hidden', '');
                a.setAttribute('href', url);
                a.setAttribute('download', 'students_export.csv');
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };
        }
    },
    settings: {
        html: `
            <div class="card" style="max-width: 600px; margin: 0 auto;">
                <div class="card-header">
                    <h3 class="card-title">Settings</h3>
                </div>
                <div class="drawer-content" style="padding: 0;">
                    <form id="settings-form" onsubmit="event.preventDefault(); alert('Settings saved to localStorage!');">
                        <h4 style="margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">Profile</h4>
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" class="form-control" id="set-name" value="Demo User">
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" class="form-control" id="set-email" value="demo@eduflow.com" disabled>
                        </div>
                        <h4 style="margin: 24px 0 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">Preferences</h4>
                        <div class="form-group" style="display: flex; align-items: center; justify-content: space-between;">
                            <label style="margin: 0;">Dark Mode</label>
                            <input type="checkbox" id="set-theme" onchange="document.documentElement.classList.toggle('dark')" style="width: 20px; height: 20px;">
                        </div>
                        <div style="margin-top: 32px; display: flex; justify-content: space-between; align-items: center;">
                            <button type="button" class="btn btn-outline" style="color: var(--danger); border-color: var(--danger);" onclick="window.resetData()">Reset Demo Data</button>
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        `,
        init: () => {
            const user = JSON.parse(sessionStorage.getItem('eduflow_user'));
            if(user) document.getElementById('set-name').value = user.name;
            if(document.documentElement.classList.contains('dark')) {
                document.getElementById('set-theme').checked = true;
            }
            window.resetData = function() {
                if(confirm("Are you sure you want to reset all mock data?")) {
                    sessionStorage.removeItem('eduflow_data');
                    window.location.reload();
                }
            };
        }
    },
    attendance: {
        html: `
            <div class="card" style="margin-bottom: 20px;">
                <div class="card-header">
                    <h3 class="card-title">Weekly Attendance Register</h3>
                </div>

                <div class="filters-bar">
                    <div class="input-group">
                        <select id="att-filter-week"></select>
                    </div>
                    <div class="input-group">
                        <select id="att-filter-class">
                            <option value="Class 10A">Class 10A</option>
                            <option value="Class 10B">Class 10B</option>
                            <option value="Class 11A">Class 11A</option>
                        </select>
                    </div>
                </div>

                <div class="table-container">
                    <table style="min-width: 800px;">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Mon</th>
                                <th>Tue</th>
                                <th>Wed</th>
                                <th>Thu</th>
                                <th>Fri</th>
                                <th>Total Present</th>
                            </tr>
                        </thead>
                        <tbody id="attendance-tbody">
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        init: (data) => {
            const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'];
            const weekSelect = document.getElementById('att-filter-week');
            if(weekSelect) {
                weeks.forEach(w => weekSelect.innerHTML += `<option value="${w}">${w}</option>`);
                weekSelect.value = 'Week 8';

                const renderGrid = () => {
                    const week = document.getElementById('att-filter-week').value;
                    const cls = document.getElementById('att-filter-class').value;

                    const students = data.students.filter(s => s.classId === cls).slice(0, 20);
                    const tbody = document.getElementById('attendance-tbody');
                    tbody.innerHTML = '';

                    students.forEach(s => {
                        const att = data.attendance.find(a => a.studentId === s.id && a.week === week);
                        let presentCount = att ? att.presentDays : 0;

                        let days = ['A','A','A','A','A'];
                        let pAssigned = 0;
                        while(pAssigned < presentCount) {
                            const idx = Math.floor(Math.random() * 5);
                            if(days[idx] === 'A') { days[idx] = 'P'; pAssigned++; }
                        }

                        const dayCells = days.map(d => `<td style="color: ${d === 'P' ? 'var(--success)' : 'var(--danger)'}; font-weight: bold; text-align: center;">${d}</td>`).join('');

                        tbody.innerHTML += `
                            <tr>
                                <td>${s.name}</td>
                                ${dayCells}
                                <td style="text-align: center; font-weight: 600;">${presentCount}/5</td>
                            </tr>
                        `;
                    });
                };

                weekSelect.addEventListener('change', renderGrid);
                document.getElementById('att-filter-class').addEventListener('change', renderGrid);

                setTimeout(renderGrid, 10);
            }
        }
    },
    assignments: {
        html: `
            <div class="card" style="margin-bottom: 20px;">
                <div class="card-header">
                    <h3 class="card-title">All Assignments</h3>
                </div>

                <div class="table-container" id="assignments-table-container"></div>
            </div>
        `,
        init: (data) => {
            const columns = [
                { key: 'title', label: 'Title' },
                { key: 'courseId', label: 'Course', render: (val) => {
                    const c = data.courses.find(co => co.id === val);
                    return c ? c.title : val;
                }},
                { key: 'dueDate', label: 'Due Date' },
                { key: 'totalSubmissions', label: 'Submitted' },
                { key: 'pending', label: 'Pending' },
                { key: 'graded', label: 'Graded' },
                { key: 'actions', label: 'Status', render: (_, row) => {
                    const isPast = new Date(row.dueDate) < new Date();
                    return window.getStatusBadge(isPast ? 'Completed' : 'Active');
                }}
            ];

            const tableContainer = document.getElementById('assignments-table-container');
            if(!tableContainer) return;
            const table = new window.VirtualTable('assignments-table-container', columns, 48);
            table.setData(data.assignments);
        }
    }
};