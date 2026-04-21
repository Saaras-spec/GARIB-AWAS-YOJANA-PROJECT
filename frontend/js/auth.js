// ─── Shared Auth Utilities ───

const AUTH_TOKEN_KEY = 'token';
const AUTH_USER_KEY = 'user';

// Save auth data to localStorage
function saveAuth(token, user) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

// Get stored token
function getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

// Get stored user object
function getUser() {
    const data = localStorage.getItem(AUTH_USER_KEY);
    return data ? JSON.parse(data) : null;
}

// Clear auth data (logout)
function logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    window.location.href = '/login';
}

// Check if user is logged in — redirect to login if not
function requireAuth() {
    const token = getToken();
    if (!token) {
        window.location.href = '/login';
        return false;
    }
    return true;
}

// Guard roles: ensure user has the correct role for the page
function requireRole(allowedRole) {
    if (!requireAuth()) return false;
    const user = getUser();
    if (user && user.role !== allowedRole) {
        // Redirect to their correct dashboard
        if (user.role === 'officer') window.location.href = '/officer/';
        else window.location.href = '/user/';
        return false;
    }
    return true;
}

// Add Authorization header to fetch requests
function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken()
    };
}
