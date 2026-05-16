// utils.js

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

export function getStatusBadge(status) {
    const classes = {
        'Active': 'badge-success',
        'Completed': 'badge-primary',
        'Pending': 'badge-warning',
        'Late': 'badge-danger',
        'Submitted': 'badge-info',
        'Graded': 'badge-success'
    };
    const cssClass = classes[status] || 'badge-primary';
    return `<span class="badge ${cssClass}">${status}</span>`;
}

export function getRiskBadge(isAtRisk) {
    if (isAtRisk) {
        return `<span class="badge badge-danger">At Risk</span>`;
    }
    return `<span class="badge badge-success">On Track</span>`;
}

export function getProgressBar(percentage) {
    let colorClass = 'progress-high';
    if (percentage < 40) colorClass = 'progress-low';
    else if (percentage < 70) colorClass = 'progress-med';

    return `
        <div class="progress-container">
            <div class="progress-bar ${colorClass}" style="width: ${percentage}%"></div>
        </div>
        <div style="font-size: 0.75rem; text-align: right; margin-top: 4px;">${percentage}%</div>
    `;
}

export function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
        <div class="loading-state">
            <div class="skeleton skeleton-circle" style="margin-bottom: 16px;"></div>
            <div class="skeleton skeleton-text" style="width: 60%;"></div>
            <div class="skeleton skeleton-text" style="width: 40%;"></div>
        </div>
    `;
}

export function showEmpty(containerId, message = "No results found.") {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
        <div class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <p>${message}</p>
        </div>
    `;
}

// Side Drawer Toggle
export function openDrawer(drawerId) {
    const drawer = document.getElementById(drawerId);
    let overlay = document.getElementById('drawer-overlay');

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'drawer-overlay';
        overlay.className = 'drawer-overlay';
        document.body.appendChild(overlay);
        overlay.addEventListener('click', () => closeDrawer(drawerId));
    }

    if (drawer) {
        drawer.classList.add('open');
        overlay.classList.add('open');
    }
}

export function closeDrawer(drawerId) {
    const drawer = document.getElementById(drawerId);
    const overlay = document.getElementById('drawer-overlay');

    if (drawer) {
        drawer.classList.remove('open');
    }
    if (overlay) {
        overlay.classList.remove('open');
    }
}
