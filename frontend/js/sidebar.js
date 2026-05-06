document.addEventListener("DOMContentLoaded", () => {
    // ─── Auth Guard: redirect to login if not authenticated ───
    if (!getToken()) {
        window.location.href = '/login';
        return;
    }

    const user = getUser();
    const userName = user ? user.name || user.email.split('@')[0] : 'User';
    const userRole = user ? user.role : 'user';
    const userInitial = userName.charAt(0).toUpperCase();

    // ─── Generate Navigation Links based on ROLE ───
    let navLinksHTML = '';
    
    if (userRole === 'officer') {
        navLinksHTML = `
            <li>
                <a href="/officer/" class="nav-item ${window.location.pathname === '/officer/' || window.location.pathname === '/officer/index.html' ? 'active' : ''}">
                    <i data-lucide="layout-dashboard"></i>
                    Dashboard
                </a>
            </li>
            <li>
                <a href="/officer/map" class="nav-item ${window.location.pathname === '/officer/map' || window.location.pathname === '/officer/map.html' ? 'active' : ''}">
                    <i data-lucide="map"></i>
                    GIS Map
                </a>
            </li>
            <li>
                <a href="/officer/register" class="nav-item ${window.location.pathname === '/officer/register' || window.location.pathname === '/officer/register.html' ? 'active' : ''}">
                    <i data-lucide="user-plus"></i>
                    Register Beneficiary
                </a>
            </li>
            <li>
                <a href="/officer/manage" class="nav-item ${window.location.pathname === '/officer/manage' || window.location.pathname === '/officer/manage.html' ? 'active' : ''}">
                    <i data-lucide="list-todo"></i>
                    Manage Records
                </a>
            </li>
            <li>
                <a href="/officer/activity-log" class="nav-item ${window.location.pathname === '/officer/activity-log' || window.location.pathname === '/officer/activity-log.html' ? 'active' : ''}">
                    <i data-lucide="clipboard-list"></i>
                    Activity Log
                </a>
            </li>
            <li>
                <a href="/officer/announcements" class="nav-item ${window.location.pathname === '/officer/announcements' || window.location.pathname === '/officer/announcements.html' ? 'active' : ''}">
                    <i data-lucide="megaphone"></i>
                    Announcements
                </a>
            </li>
        `;
    } else {
        // Beneficiary (User) Sidebar
        navLinksHTML = `
            <li>
                <a href="/user/" class="nav-item ${window.location.pathname === '/user/' || window.location.pathname === '/user/index.html' ? 'active' : ''}">
                    <i data-lucide="layout-dashboard"></i>
                    Dashboard
                </a>
            </li>
            <li>
                <a href="/user/details" class="nav-item ${window.location.pathname === '/user/details' || window.location.pathname === '/user/details.html' ? 'active' : ''}">
                    <i data-lucide="user"></i>
                    User Details
                </a>
            </li>
            <li>
                <a href="/user/map" class="nav-item ${window.location.pathname === '/user/map' || window.location.pathname === '/user/map.html' ? 'active' : ''}">
                    <i data-lucide="map-pin"></i>
                    GIS Map
                </a>
            </li>
            <li>
                <a href="/user/notifications" class="nav-item ${window.location.pathname === '/user/notifications' || window.location.pathname === '/user/notifications.html' ? 'active' : ''}">
                    <i data-lucide="bell"></i>
                    Notifications
                </a>
            </li>
            <li>
                <a href="/user/messages" class="nav-item ${window.location.pathname === '/user/messages' || window.location.pathname === '/user/messages.html' ? 'active' : ''}">
                    <i data-lucide="message-circle"></i>
                    Message Officer
                </a>
            </li>
        `;
    }

    const sidebarHTML = `
        <nav class="sidebar">
            <h2>Garib Awas Yojana MIS</h2>
            <ul class="nav-links">
                ${navLinksHTML}
            </ul>

            <div class="sidebar-user">
                <div class="sidebar-user-info">
                    <div class="sidebar-avatar">${userInitial}</div>
                    <div>
                        <div class="sidebar-user-name">${userName}</div>
                        <div class="sidebar-user-role">${userRole}</div>
                    </div>
                </div>
                <button class="btn-logout" onclick="logout()">
                    <i data-lucide="log-out" style="width:16px;height:16px;"></i>
                    Sign Out
                </button>
            </div>
        </nav>
    `;

    // Inject sidebar into the container
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
        appContainer.insertAdjacentHTML('afterbegin', sidebarHTML);
        // Initialize lucide icons for the newly injected HTML
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
});
