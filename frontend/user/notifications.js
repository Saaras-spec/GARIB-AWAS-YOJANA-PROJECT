document.addEventListener("DOMContentLoaded", () => {
    if (!requireRole('user')) return;

    function formatDate(d) {
        return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    function loadNotifications() {
        fetch('/api/notifications', { headers: authHeaders() })
            .then(res => res.json())
            .then(data => {
                const list = document.getElementById('notif-list');
                if (!data || data.length === 0) {
                    list.innerHTML = `<div class="empty-state"><i data-lucide="bell-off" style="width:48px;height:48px;opacity:0.4;"></i><p style="margin-top:0.5rem;font-weight:600;">No notifications yet</p></div>`;
                    lucide.createIcons();
                    return;
                }
                list.innerHTML = data.map(n => `
                    <div class="notif-item ${n.isRead ? 'read' : 'unread'}" data-id="${n._id}">
                        <div class="notif-msg">${!n.isRead ? '<span class="notif-dot"></span>' : ''}${n.message}</div>
                        <div class="notif-time">${formatDate(n.createdAt)}</div>
                    </div>
                `).join('');

                // Mark as read on click
                document.querySelectorAll('.notif-item.unread').forEach(item => {
                    item.addEventListener('click', async () => {
                        await fetch(`/api/notifications/${item.dataset.id}/read`, { method: 'PATCH', headers: authHeaders() });
                        item.classList.remove('unread');
                        item.classList.add('read');
                        const dot = item.querySelector('.notif-dot');
                        if (dot) dot.remove();
                    });
                });
            })
            .catch(err => console.error('Notifications error:', err));
    }

    loadNotifications();
});
