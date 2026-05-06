document.addEventListener("DOMContentLoaded", () => {
    if (!requireRole('officer')) return;

    let allLogs = [];

    function formatDate(d) {
        return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    function statusBadge(status) {
        let cls = 'status-construction';
        if (status === 'Completed') cls = 'status-completed';
        if (status === 'Pending') cls = 'status-pending';
        return `<span class="status-badge ${cls}">${status}</span>`;
    }

    function renderLogs(logs) {
        const tbody = document.getElementById('log-body');
        if (logs.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="padding:2rem;text-align:center;color:var(--text-secondary);">No activity logs yet.</td></tr>`;
            return;
        }
        tbody.innerHTML = logs.map(l => `
            <tr>
                <td style="font-weight:500;text-transform:capitalize;">${l.beneficiaryName}</td>
                <td>${statusBadge(l.oldStatus)}</td>
                <td>${statusBadge(l.newStatus)}</td>
                <td style="text-transform:capitalize;">${l.officerName}</td>
                <td style="color:var(--text-secondary);font-size:0.85rem;">${formatDate(l.changedAt)}</td>
            </tr>
        `).join('');
    }

    fetch('/api/logs', { headers: authHeaders() })
        .then(res => { if (res.status === 401 || res.status === 403) { logout(); return; } return res.json(); })
        .then(data => {
            if (!data) return;
            allLogs = data;
            renderLogs(allLogs);
        })
        .catch(err => console.error('Error fetching logs:', err));

    document.getElementById('log-search').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        const filtered = allLogs.filter(l => l.beneficiaryName.toLowerCase().includes(term));
        renderLogs(filtered);
    });
});
