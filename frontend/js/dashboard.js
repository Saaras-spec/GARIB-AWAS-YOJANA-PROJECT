document.addEventListener("DOMContentLoaded", async () => {
    if (!requireRole('officer')) return;

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
        })
        .catch(err => console.error('Error fetching stats:', err));
});
