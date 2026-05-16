// auth.js
// FIREBASE REPLACEMENT: Replace sessionStorage check with Firebase Auth token verification

const DEMO_USERS = {
    'admin@eduflow.com': { role: 'Admin', userId: 'A0001', name: 'System Admin', password: 'admin123' },
    'teacher@eduflow.com': { role: 'Teacher', userId: 'T001', name: 'Demo Teacher', password: 'teach123' },
    'student@eduflow.com': { role: 'Student', userId: 'S0001', name: 'Demo Student', password: 'study123' }
};

export function login(email, password) {
    const user = DEMO_USERS[email];
    if (user && user.password === password) {
        const { password: _, ...userData } = user;
        sessionStorage.setItem('eduflow_user', JSON.stringify(userData));
        return true;
    }
    return false;
}

export function logout() {
    sessionStorage.removeItem('eduflow_user');
    window.location.href = 'index.html';
}

export function checkAuth() {
    const userJson = sessionStorage.getItem('eduflow_user');
    if (!userJson) {
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(userJson);
}

export function getUser() {
    const userJson = sessionStorage.getItem('eduflow_user');
    return userJson ? JSON.parse(userJson) : null;
}

export function initAuthUI() {
    const user = getUser();
    if (user) {
        const nameEls = document.querySelectorAll('.user-name');
        const roleEls = document.querySelectorAll('.user-role');
        const avatarEls = document.querySelectorAll('.avatar');

        nameEls.forEach(el => el.textContent = user.name);
        roleEls.forEach(el => el.textContent = user.role);
        avatarEls.forEach(el => el.textContent = user.name.charAt(0).toUpperCase());
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}
