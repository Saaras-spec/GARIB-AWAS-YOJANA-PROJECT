document.addEventListener("DOMContentLoaded", async () => {
    if (!requireRole('officer')) return;

    // ── Helper: format date to Indian format ──
    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    // ── Fetch statistics and populate cards ──
    fetch('/api/statistics', { headers: authHeaders() })
        .then(res => {
            if (res.status === 401 || res.status === 403) { logout(); return; }
            return res.json();
        })
        .then(data => {
            if (!data) return;
            document.getElementById('stats-total').textContent = data.total || 0;
            document.getElementById('stats-pending').textContent = data.pending || 0;
            document.getElementById('stats-underConstruction').textContent = data.underConstruction || 0;
            document.getElementById('stats-completed').textContent = data.completed || 0;

            // ── Doughnut Chart — Status Distribution ──
            renderStatusChart(data);
        })
        .catch(err => console.error('Error fetching stats:', err));

    // ── Fetch beneficiaries for month-wise registration chart ──
    fetch('/api/beneficiaries', { headers: authHeaders() })
        .then(res => {
            if (res.status === 401 || res.status === 403) return;
            return res.json();
        })
        .then(data => {
            if (!data) return;
            // Handle paginated response
            const beneficiaries = data.beneficiaries || data;
            if (!Array.isArray(beneficiaries)) return;
            renderRegistrationChart(beneficiaries);
        })
        .catch(err => console.error('Error fetching beneficiaries for chart:', err));

    // ── Feature 7: Fetch average satisfaction rating ──
    fetch('/api/ratings/average', { headers: authHeaders() })
        .then(res => res.json())
        .then(data => {
            if (!data) return;
            document.getElementById('avg-rating-value').textContent = `⭐ ${data.average || 0}`;
            document.getElementById('rating-count').textContent = `${data.totalRatings || 0} ratings received`;
        })
        .catch(err => console.error('Error fetching ratings:', err));

    // ── Feature 4: Bell Notification ──
    const bellWrapper = document.getElementById('bell-wrapper');
    const bellBadge = document.getElementById('bell-badge');
    const bellDropdown = document.getElementById('bell-dropdown');
    const bellDropdownBody = document.getElementById('bell-dropdown-body');

    // Fetch unread count
    fetch('/api/notifications/unread-count', { headers: authHeaders() })
        .then(res => res.json())
        .then(data => {
            if (data && data.count > 0) {
                bellBadge.textContent = data.count > 99 ? '99+' : data.count;
                bellBadge.style.display = 'flex';
            }
        })
        .catch(err => console.error('Error fetching notification count:', err));

    // Fetch recent notifications for dropdown
    fetch('/api/notifications', { headers: authHeaders() })
        .then(res => res.json())
        .then(notifications => {
            if (!notifications || notifications.length === 0) {
                bellDropdownBody.innerHTML = '<div class="bell-dropdown-empty">No notifications</div>';
                return;
            }
            const recent = notifications.slice(0, 5);
            bellDropdownBody.innerHTML = recent.map(n => `
                <div class="bell-dropdown-item">
                    <div>${n.message}</div>
                    <div class="notif-time">${formatDate(n.createdAt)}</div>
                </div>
            `).join('');
        })
        .catch(err => console.error('Error fetching notifications:', err));

    // Toggle bell dropdown
    bellWrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        bellDropdown.classList.toggle('open');
    });
    document.addEventListener('click', () => {
        bellDropdown.classList.remove('open');
    });

    // ── Doughnut Chart Renderer ──
    function renderStatusChart(stats) {
        const ctx = document.getElementById('statusChart');
        if (!ctx) return;

        const values = [stats.pending || 0, stats.underConstruction || 0, stats.completed || 0];
        const hasData = values.some(v => v > 0);

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Pending', 'Under Construction', 'Completed'],
                datasets: [{
                    data: hasData ? values : [1],
                    backgroundColor: hasData
                        ? ['#dc2626', '#FF9933', '#138808']
                        : ['#e5e7eb'],
                    borderColor: hasData
                        ? ['#fef2f2', '#fff7ed', '#f0fdf4']
                        : ['#f9fafb'],
                    borderWidth: 3,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyleWidth: 12,
                            font: { size: 12, weight: '500', family: "'Inter', sans-serif" },
                            color: '#4b5563'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,128,0.9)',
                        titleFont: { size: 13, weight: '600' },
                        bodyFont: { size: 12 },
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                if (!hasData) return 'No data yet';
                                const total = values.reduce((a, b) => a + b, 0);
                                const pct = total > 0 ? ((context.raw / total) * 100).toFixed(1) : 0;
                                return ` ${context.label}: ${context.raw} (${pct}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // ── Bar Chart Renderer — Month-wise Registrations ──
    function renderRegistrationChart(beneficiaries) {
        const ctx = document.getElementById('registrationChart');
        if (!ctx) return;

        // Group by month
        const monthCounts = {};
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        beneficiaries.forEach(b => {
            if (!b.createdAt) return;
            const d = new Date(b.createdAt);
            const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
            monthCounts[key] = (monthCounts[key] || 0) + 1;
        });

        // Sort chronologically
        const sortedKeys = Object.keys(monthCounts).sort((a, b) => {
            const parse = s => {
                const [mon, yr] = s.split(' ');
                return new Date(`${mon} 1, ${yr}`);
            };
            return parse(a) - parse(b);
        });

        // Take last 12 months max
        const labels = sortedKeys.slice(-12);
        const data = labels.map(k => monthCounts[k]);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Registrations',
                    data,
                    backgroundColor: labels.map((_, i) => {
                        // Gradient-like effect across bars
                        const t = labels.length > 1 ? i / (labels.length - 1) : 0.5;
                        if (t < 0.5) {
                            return `rgba(255, 153, 51, ${0.6 + t * 0.8})`;
                        }
                        return `rgba(19, 136, 8, ${0.4 + (t - 0.5) * 1.2})`;
                    }),
                    borderRadius: 8,
                    borderSkipped: false,
                    maxBarThickness: 48
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,128,0.9)',
                        titleFont: { size: 13, weight: '600' },
                        bodyFont: { size: 12 },
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: ctx => ` ${ctx.raw} registration${ctx.raw !== 1 ? 's' : ''}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            font: { size: 11, weight: '500', family: "'Inter', sans-serif" },
                            color: '#6b7280'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            font: { size: 11, family: "'Inter', sans-serif" },
                            color: '#9ca3af'
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.04)',
                            drawBorder: false
                        }
                    }
                }
            }
        });
    }
});
