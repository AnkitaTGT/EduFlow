// router.js

export function initRouter(routes, defaultRoute) {
    const renderRoute = async () => {
        const hash = window.location.hash.slice(1) || defaultRoute;
        const mainContent = document.getElementById('page-content');
        if (!mainContent) return;

        // Update active nav state
        document.querySelectorAll('.nav-item').forEach(el => {
            el.classList.remove('active');
            if (el.getAttribute('href') === `#${hash}`) {
                el.classList.add('active');
            }
        });

        // Show loading
        mainContent.innerHTML = `
            <div class="loading-state">
                <div class="skeleton skeleton-circle" style="margin-bottom: 16px;"></div>
                <div class="skeleton skeleton-text" style="width: 60%;"></div>
                <div class="skeleton skeleton-text" style="width: 40%;"></div>
            </div>
        `;

        const routeFn = routes[hash] || routes[defaultRoute];
        if (routeFn) {
            // Simulate network delay for loading state
            setTimeout(() => {
                if (typeof routeFn === 'function') {
                    routeFn(mainContent);
                } else if (routeFn.html) {
                    mainContent.innerHTML = routeFn.html;
                    if (routeFn.init) routeFn.init(window.EduFlowData);
                }
            }, 100);
        } else {
             mainContent.innerHTML = `<div class="empty-state"><p>Page not found.</p></div>`;
        }
    };

    window.addEventListener('hashchange', renderRoute);
    renderRoute(); // Initial load
}
