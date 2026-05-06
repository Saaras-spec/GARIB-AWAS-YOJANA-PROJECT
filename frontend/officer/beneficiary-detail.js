document.addEventListener("DOMContentLoaded", () => {
    if (!requireRole('officer')) return;

    const params = new URLSearchParams(window.location.search);
    const beneficiaryId = params.get('id');
    if (!beneficiaryId) { window.location.href = '/officer/manage'; return; }

    const user = getUser();
    let chatInterval = null;

    function formatDate(d) {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    function formatTime(d) {
        return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    }

    // ── Load beneficiary details ──
    fetch(`/api/beneficiaries/${beneficiaryId}`, { headers: authHeaders() })
        .then(res => { if (!res.ok) throw new Error('Not found'); return res.json(); })
        .then(b => {
            document.getElementById('page-title').textContent = b.name;
            let statusClass = 'status-construction';
            if (b.status === 'Completed') statusClass = 'status-completed';
            if (b.status === 'Pending') statusClass = 'status-pending';

            document.getElementById('detail-grid').innerHTML = `
                <div class="detail-item"><label>Full Name</label><div class="val">${b.name}</div></div>
                <div class="detail-item"><label>Age</label><div class="val">${b.age}</div></div>
                <div class="detail-item"><label>Family Members</label><div class="val">${b.familyMembers}</div></div>
                <div class="detail-item"><label>Annual Income</label><div class="val">₹${b.income?.toLocaleString('en-IN') || 0}</div></div>
                <div class="detail-item"><label>Address</label><div class="val">${b.address}</div></div>
                <div class="detail-item"><label>Status</label><div class="val"><span class="status-badge ${statusClass}">${b.status}</span></div></div>
                <div class="detail-item"><label>Officer</label><div class="val">${b.officerId?.name || '—'}</div></div>
                <div class="detail-item"><label>Expected Completion</label><div class="val">${b.expectedCompletionDate ? formatDate(b.expectedCompletionDate) : '—'}</div></div>
            `;
        })
        .catch(err => {
            document.getElementById('detail-grid').innerHTML = `<p style="color:var(--danger);">Failed to load details: ${err.message}</p>`;
        });

    // ── Load installments ──
    function loadInstallments() {
        fetch(`/api/installments/${beneficiaryId}`, { headers: authHeaders() })
            .then(res => res.json())
            .then(data => {
                const tbody = document.getElementById('installment-body');
                if (!data || data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" style="padding:1.5rem;text-align:center;color:var(--text-secondary);">No installments configured.</td></tr>';
                    return;
                }
                tbody.innerHTML = data.map(inst => {
                    const ordinal = ['1st', '2nd', '3rd'][inst.installmentNumber - 1] || inst.installmentNumber;
                    const statusIcon = inst.status === 'Released' ? '✅' : '🟡';
                    return `<tr>
                        <td>${ordinal}</td>
                        <td>₹${inst.amount?.toLocaleString('en-IN') || 0}</td>
                        <td>${statusIcon} ${inst.status}</td>
                        <td>${inst.releasedAt ? formatDate(inst.releasedAt) : '—'}</td>
                        <td>${inst.status === 'Pending' ? `<button class="btn-release" data-id="${inst._id}">Release</button>` : '—'}</td>
                    </tr>`;
                }).join('');

                document.querySelectorAll('.btn-release').forEach(btn => {
                    btn.addEventListener('click', async () => {
                        await fetch(`/api/installments/${btn.dataset.id}/release`, { method: 'PATCH', headers: authHeaders() });
                        loadInstallments();
                    });
                });
            })
            .catch(err => console.error('Installment error:', err));
    }
    loadInstallments();

    // ── Chat ──
    function loadMessages() {
        fetch(`/api/messages/${beneficiaryId}`, { headers: authHeaders() })
            .then(res => res.json())
            .then(messages => {
                const container = document.getElementById('chat-messages');
                if (!messages || messages.length === 0) {
                    container.innerHTML = '<div style="text-align:center;color:var(--text-secondary);padding:2rem;">No messages yet. Start the conversation!</div>';
                    return;
                }
                container.innerHTML = messages.map(m => {
                    const isOfficer = m.senderRole === 'officer';
                    return `<div class="chat-bubble ${isOfficer ? 'officer' : 'user'}">
                        <div>${m.message}</div>
                        <div class="chat-time">${formatTime(m.createdAt)}</div>
                    </div>`;
                }).join('');
                container.scrollTop = container.scrollHeight;
            })
            .catch(err => console.error('Chat error:', err));
    }
    loadMessages();
    chatInterval = setInterval(loadMessages, 5000);

    document.getElementById('btn-send').addEventListener('click', sendMessage);
    document.getElementById('chat-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

    async function sendMessage() {
        const input = document.getElementById('chat-input');
        const msg = input.value.trim();
        if (!msg) return;
        try {
            await fetch('/api/messages/send', {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({ receiverId: beneficiaryId, message: msg })
            });
            input.value = '';
            loadMessages();
        } catch (err) { console.error('Send error:', err); }
    }
});
