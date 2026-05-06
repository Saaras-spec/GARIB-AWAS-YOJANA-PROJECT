document.addEventListener("DOMContentLoaded", () => {
    if (!requireRole('officer')) return;
    const user = getUser();

    function formatDate(d) {
        return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    function loadAnnouncements() {
        fetch('/api/announcements', { headers: authHeaders() })
            .then(res => res.json())
            .then(data => {
                const list = document.getElementById('announce-list');
                if (!data || data.length === 0) {
                    list.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:2rem;">No announcements yet.</p>';
                    return;
                }
                list.innerHTML = data.map(a => `
                    <div class="card announce-card">
                        <h3>📢 ${a.title}</h3>
                        <p>${a.message}</p>
                        <div class="announce-meta">Posted by ${a.officerName} — ${formatDate(a.postedAt)}</div>
                        ${a.postedBy === user.id ? `<button class="btn-delete-announce" data-id="${a._id}">Delete</button>` : ''}
                    </div>
                `).join('');

                document.querySelectorAll('.btn-delete-announce').forEach(btn => {
                    btn.addEventListener('click', async () => {
                        if (!confirm('Delete this announcement?')) return;
                        await fetch(`/api/announcements/${btn.dataset.id}`, { method: 'DELETE', headers: authHeaders() });
                        loadAnnouncements();
                    });
                });
            })
            .catch(err => console.error('Error:', err));
    }

    document.getElementById('btn-post').addEventListener('click', async () => {
        const title = document.getElementById('announce-title').value.trim();
        const message = document.getElementById('announce-message').value.trim();
        const msg = document.getElementById('announce-msg');

        if (!title || !message) { msg.textContent = 'Title and message are required'; msg.style.display = 'block'; msg.style.background = 'rgba(220,38,38,0.1)'; msg.style.color = 'var(--danger)'; return; }

        try {
            const res = await fetch('/api/announcements', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ title, message }) });
            if (res.ok) {
                document.getElementById('announce-title').value = '';
                document.getElementById('announce-message').value = '';
                msg.textContent = 'Announcement posted!'; msg.style.display = 'block'; msg.style.background = 'rgba(19,136,8,0.1)'; msg.style.color = 'var(--green)';
                loadAnnouncements();
                setTimeout(() => { msg.style.display = 'none'; }, 3000);
            }
        } catch (err) { console.error('Post error:', err); }
    });

    loadAnnouncements();
});
