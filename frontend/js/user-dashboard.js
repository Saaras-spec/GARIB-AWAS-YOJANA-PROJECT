document.addEventListener("DOMContentLoaded", () => {
    if (!requireRole('user')) return;

    const AUTH_TOKEN_KEY = 'token';
    const AUTH_USER_KEY = 'user';
    const user = JSON.parse(localStorage.getItem(AUTH_USER_KEY));
    const welcomeMsg = document.getElementById('welcome-message');
    if (welcomeMsg && user) {
        welcomeMsg.textContent = `Welcome, ${user.name}`;
    }

    // Fetch from absolute URL with content-type validation as requested
     const API_URL = "/api/user/me";
    const token = localStorage.getItem("token");
    
    fetch(API_URL, { 
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        } 
    })
        .then(async res => {
            const contentType = res.headers.get("content-type");
            
            if (!contentType || !contentType.includes("application/json")) {
                const text = await res.text();
                console.error("Server returned non-JSON response:", text);
                throw new Error("API did not return JSON");
            }

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || 'Failed to load records');
            }
            return data;
        })
        .then(data => {
            if (!data) return;

            // 1. Status Card Logic
            const statusEl = document.getElementById('user-status');
            const isApproved = data.status === 'Under Construction' || data.status === 'Completed';
            
            statusEl.textContent = isApproved ? 'Approved' : 'Pending';
            statusEl.style.color = isApproved ? 'var(--green)' : 'var(--saffron)';
            
            // 2. Officer Card Logic
            const officerNameEl = document.getElementById('officer-name');
            // Populate officer name if link exists, otherwise "Not Assigned"
            officerNameEl.textContent = data.officerId?.name || "Not Assigned";

            // 3. Current Stage Logic
            const stageEl = document.getElementById('project-stage');
            stageEl.textContent = data.status || 'Not Started';
            
            // Apply standard design colors to stage
            if (data.status === 'Completed') stageEl.style.color = 'var(--green)';
            else if (data.status === 'Under Construction') stageEl.style.color = 'var(--navy)';
            else stageEl.style.color = 'var(--text-secondary)';

            lucide.createIcons();
        })
        .catch(err => {
            console.error('User Dashboard Error:', err);
            const container = document.querySelector('.metrics-grid');
            if (container) {
                container.innerHTML = `
                    <div style="grid-column: span 3; text-align: center; color: var(--danger); padding: 2rem; background: rgba(220,38,38,0.05); border-radius: 1rem; border: 1px solid rgba(220,38,38,0.1);">
                        <i data-lucide="alert-circle" style="margin-bottom: 0.5rem;"></i>
                        <div style="font-weight: 600;">Failed to load records</div>
                        <div style="font-size: 0.9rem; opacity: 0.8;">${err.message}</div>
                    </div>`;
                lucide.createIcons();
            }
        });
});
