document.addEventListener("DOMContentLoaded", () => {
    if (!requireRole('user')) return;

    const AUTH_TOKEN_KEY = 'token';
    const AUTH_USER_KEY = 'user';
    const LAST_STATUS_KEY = 'lastSeenStatus';

    const user = JSON.parse(localStorage.getItem(AUTH_USER_KEY));
    const welcomeMsg = document.getElementById('welcome-message');
    if (welcomeMsg && user) {
        welcomeMsg.textContent = `Welcome, ${user.name}`;
    }

    // ── Notification dismiss handler (Feature 4) ──
    document.getElementById('btn-dismiss-notif').addEventListener('click', () => {
        const banner = document.getElementById('status-notification');
        banner.classList.remove('visible');
        // Store current status so banner doesn't reappear
        const currentStatus = banner.getAttribute('data-current-status');
        if (currentStatus) {
            localStorage.setItem(LAST_STATUS_KEY, currentStatus);
        }
    });

    // Fetch user data
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

            // 3. Progress Tracker (Feature 3)
            renderProgressTracker(data.status);

            // 4. Status Notification Badge (Feature 4)
            checkStatusNotification(data.status);

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

    // ── Progress Tracker Renderer (Feature 3) ──
    function renderProgressTracker(status) {
        // Map status to step index
        // Step 0 = Registered (always completed if user exists)
        // Step 1 = Pending
        // Step 2 = Under Construction
        // Step 3 = Completed
        const statusToStep = {
            'Pending': 1,
            'Under Construction': 2,
            'Completed': 3
        };

        const currentStepIndex = statusToStep[status] ?? 1;
        const steps = document.querySelectorAll('.progress-step');

        steps.forEach((stepEl, index) => {
            // Remove any existing state classes
            stepEl.classList.remove('step-completed', 'step-current', 'step-future');

            if (index < currentStepIndex) {
                stepEl.classList.add('step-completed');
                // Replace number with checkmark for completed steps
                stepEl.querySelector('.step-circle').innerHTML = '✓';
            } else if (index === currentStepIndex) {
                stepEl.classList.add('step-current');
            } else {
                stepEl.classList.add('step-future');
            }
        });

        // Step 0 (Registered) is always completed since the user exists
        const firstStep = steps[0];
        if (firstStep && currentStepIndex >= 1) {
            firstStep.classList.remove('step-current', 'step-future');
            firstStep.classList.add('step-completed');
            firstStep.querySelector('.step-circle').innerHTML = '✓';
        }

        // Animate the green connecting line
        const lineFill = document.getElementById('progress-line-fill');
        if (lineFill) {
            // Calculate width as percentage of the total track
            // 0 steps completed = 0%, 1 = 33%, 2 = 66%, 3 = 100%
            const completedSteps = Math.min(currentStepIndex, 3);
            const pct = (completedSteps / 3) * 100;
            // Use a slight delay for animation effect
            setTimeout(() => {
                lineFill.style.width = `${pct}%`;
            }, 100);
        }
    }

    // ── Status Notification Check (Feature 4) ──
    function checkStatusNotification(currentStatus) {
        const lastSeen = localStorage.getItem(LAST_STATUS_KEY);
        const banner = document.getElementById('status-notification');

        // Store current status on the banner element for the dismiss handler
        banner.setAttribute('data-current-status', currentStatus);

        if (lastSeen === null) {
            // First visit — store current status, don't show banner
            localStorage.setItem(LAST_STATUS_KEY, currentStatus);
            return;
        }

        if (lastSeen !== currentStatus) {
            // Status has changed since last visit — show notification
            banner.classList.add('visible');
        }
    }
});
