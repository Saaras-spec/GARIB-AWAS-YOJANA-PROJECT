document.addEventListener("DOMContentLoaded", () => {
    if (!requireRole('user')) return;

    const user = JSON.parse(localStorage.getItem('user'));
    const welcomeMsg = document.getElementById('welcome-message');
    if (welcomeMsg && user) welcomeMsg.textContent = `Welcome, ${user.name}`;

    function formatDate(d) {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    // ── Fetch user data ──
    fetch("/api/user/me", { headers: authHeaders() })
        .then(async res => {
            const ct = res.headers.get("content-type");
            if (!ct || !ct.includes("application/json")) throw new Error("API did not return JSON");
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to load');
            return data;
        })
        .then(data => {
            if (!data) return;

            // Status Card
            const statusEl = document.getElementById('user-status');
            const isApproved = data.status === 'Under Construction' || data.status === 'Completed';
            statusEl.textContent = isApproved ? 'Approved' : 'Pending';
            statusEl.style.color = isApproved ? 'var(--green)' : 'var(--saffron)';

            // Officer Card
            document.getElementById('officer-name').textContent = data.officerId?.name || "Not Assigned";

            // Progress Tracker
            renderProgressTracker(data.status);

            // Feature 6: Countdown
            renderCountdown(data);

            // Feature 7: Rating
            if (data.status === 'Completed') {
                loadRating(data._id);
            }

            // Feature 8: Installments
            loadInstallments(data._id);

            lucide.createIcons();
        })
        .catch(err => {
            console.error('Dashboard Error:', err);
            const container = document.querySelector('.metrics-grid');
            if (container) {
                container.innerHTML = `<div style="grid-column:span 3;text-align:center;color:var(--danger);padding:2rem;background:rgba(220,38,38,0.05);border-radius:1rem;"><div style="font-weight:600;">Failed to load records</div><div style="font-size:0.9rem;">${err.message}</div></div>`;
            }
        });

    // ── Feature 9: Announcements ──
    fetch('/api/announcements', { headers: authHeaders() })
        .then(res => res.json())
        .then(data => {
            const board = document.getElementById('notice-board');
            if (!data || data.length === 0) {
                board.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:1rem;">No announcements yet</p>';
                return;
            }
            const latest = data.slice(0, 3);
            board.innerHTML = latest.map(a => `
                <div class="card announce-mini">
                    <h4>📢 ${a.title}</h4>
                    <p>${a.message}</p>
                    <div class="meta">Posted by ${a.officerName} — ${formatDate(a.postedAt)}</div>
                </div>
            `).join('');
        })
        .catch(err => console.error('Announcements error:', err));

    // ── Progress Tracker ──
    function renderProgressTracker(status) {
        const map = { 'Pending': 1, 'Under Construction': 2, 'Completed': 3 };
        const idx = map[status] ?? 1;
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach((el, i) => {
            el.classList.remove('step-completed', 'step-current', 'step-future');
            if (i < idx) { el.classList.add('step-completed'); el.querySelector('.step-circle').innerHTML = '✓'; }
            else if (i === idx) el.classList.add('step-current');
            else el.classList.add('step-future');
        });
        if (idx >= 1) { steps[0].classList.remove('step-current','step-future'); steps[0].classList.add('step-completed'); steps[0].querySelector('.step-circle').innerHTML = '✓'; }
        const fill = document.getElementById('progress-line-fill');
        if (fill) setTimeout(() => { fill.style.width = `${(Math.min(idx, 3) / 3) * 100}%`; }, 100);
    }

    // ── Feature 6: Countdown ──
    function renderCountdown(data) {
        const card = document.getElementById('countdown-card');
        const valEl = document.getElementById('countdown-value');
        const subEl = document.getElementById('countdown-sub');

        if (data.status === 'Completed') { card.style.display = 'none'; return; }
        if (data.status === 'Pending') {
            card.style.display = 'block';
            valEl.textContent = 'Construction not yet started';
            valEl.style.fontSize = '1.1rem';
            subEl.textContent = '';
            return;
        }
        if (data.status === 'Under Construction' && data.expectedCompletionDate) {
            card.style.display = 'block';
            const target = new Date(data.expectedCompletionDate);
            const now = new Date();
            const diffMs = target - now;
            const diffDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
            valEl.textContent = formatDate(data.expectedCompletionDate);
            subEl.textContent = diffDays > 0 ? `${diffDays} days remaining` : 'Expected date reached';
        } else if (data.status === 'Under Construction') {
            card.style.display = 'block';
            valEl.textContent = 'Under Construction';
            valEl.style.fontSize = '1.1rem';
            subEl.textContent = 'No expected date set';
        }
        lucide.createIcons();
    }

    // ── Feature 7: Rating ──
    function loadRating(beneficiaryId) {
        const card = document.getElementById('rating-card');
        const content = document.getElementById('rating-content');
        card.style.display = 'block';

        fetch('/api/ratings/my', { headers: authHeaders() })
            .then(res => res.json())
            .then(existing => {
                if (existing && existing.rating) {
                    // Show read-only rating
                    content.innerHTML = `
                        <div class="star-rating rating-readonly">${[1,2,3,4,5].map(i => `<span class="star ${i <= existing.rating ? 'active' : ''}">★</span>`).join('')}</div>
                        ${existing.comment ? `<p style="color:var(--text-secondary);font-size:0.9rem;margin-top:0.5rem;">"${existing.comment}"</p>` : ''}
                        <p style="color:var(--green);font-weight:600;margin-top:0.5rem;">Thank you for your feedback!</p>
                    `;
                } else {
                    // Show rating form
                    let selectedRating = 0;
                    content.innerHTML = `
                        <div class="star-rating" id="star-container">${[1,2,3,4,5].map(i => `<span class="star" data-val="${i}">★</span>`).join('')}</div>
                        <div class="form-group" style="margin-top:0.5rem;">
                            <textarea id="rating-comment" class="form-input" rows="2" placeholder="Optional: Share your experience..."></textarea>
                        </div>
                        <button class="btn-primary" id="btn-submit-rating" style="max-width:180px;margin-top:0.5rem;">Submit Rating</button>
                    `;
                    const stars = document.querySelectorAll('#star-container .star');
                    stars.forEach(s => {
                        s.addEventListener('click', () => {
                            selectedRating = parseInt(s.dataset.val);
                            stars.forEach((st, i) => st.classList.toggle('active', i < selectedRating));
                        });
                    });
                    document.getElementById('btn-submit-rating').addEventListener('click', async () => {
                        if (selectedRating === 0) { alert('Please select a rating'); return; }
                        const comment = document.getElementById('rating-comment').value.trim();
                        const res = await fetch('/api/ratings', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ rating: selectedRating, comment }) });
                        if (res.ok) { loadRating(beneficiaryId); }
                        else { const d = await res.json(); alert(d.error || 'Failed'); }
                    });
                }
            })
            .catch(err => console.error('Rating error:', err));
    }

    // ── Feature 8: Installments ──
    function loadInstallments(beneficiaryId) {
        fetch(`/api/installments/${beneficiaryId}`, { headers: authHeaders() })
            .then(res => res.json())
            .then(data => {
                if (!data || data.length === 0) return;
                document.getElementById('installment-title').style.display = 'flex';
                document.getElementById('installment-card').style.display = 'block';
                const tbody = document.getElementById('installment-body');
                tbody.innerHTML = data.map(inst => {
                    const ord = ['1st','2nd','3rd'][inst.installmentNumber - 1] || inst.installmentNumber;
                    const icon = inst.status === 'Released' ? '✅' : '🟡';
                    return `<tr><td>${ord}</td><td>₹${inst.amount?.toLocaleString('en-IN') || 0}</td><td>${icon} ${inst.status}</td><td>${inst.releasedAt ? formatDate(inst.releasedAt) : '—'}</td></tr>`;
                }).join('');
            })
            .catch(err => console.error('Installment error:', err));
    }
});
