document.addEventListener("DOMContentLoaded", () => {
    if (!requireRole('user')) return;

    const currentUser = getUser();
    let officerId = null;

    function formatTime(d) {
        return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    }

    // First, get user's beneficiary data to find the assigned officer
    fetch('/api/user/me', { headers: authHeaders() })
        .then(res => res.json())
        .then(data => {
            if (data && data.officerId) {
                officerId = typeof data.officerId === 'object' ? data.officerId._id : data.officerId;
                loadMessages();
                // Poll every 5 seconds
                setInterval(loadMessages, 5000);
            } else {
                document.getElementById('chat-messages').innerHTML = '<div class="chat-empty">No officer assigned yet. Please contact administration.</div>';
            }
        })
        .catch(err => {
            console.error('Error:', err);
            document.getElementById('chat-messages').innerHTML = '<div class="chat-empty">Failed to load chat. Please try again.</div>';
        });

    function loadMessages() {
        if (!officerId) return;
        fetch(`/api/messages/${officerId}`, { headers: authHeaders() })
            .then(res => res.json())
            .then(messages => {
                const container = document.getElementById('chat-messages');
                if (!messages || messages.length === 0) {
                    container.innerHTML = '<div class="chat-empty">No messages yet. Send a message to your officer!</div>';
                    return;
                }
                container.innerHTML = messages.map(m => {
                    const isUser = m.senderRole === 'user';
                    return `<div class="chat-bubble ${isUser ? 'user' : 'officer'}">
                        <div>${m.message}</div>
                        <div class="chat-time">${formatTime(m.createdAt)}</div>
                    </div>`;
                }).join('');
                container.scrollTop = container.scrollHeight;
            })
            .catch(err => console.error('Chat error:', err));
    }

    document.getElementById('btn-send').addEventListener('click', sendMessage);
    document.getElementById('chat-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

    async function sendMessage() {
        if (!officerId) { alert('No officer assigned'); return; }
        const input = document.getElementById('chat-input');
        const msg = input.value.trim();
        if (!msg) return;
        try {
            await fetch('/api/messages/send', {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({ receiverId: officerId, message: msg })
            });
            input.value = '';
            loadMessages();
        } catch (err) { console.error('Send error:', err); }
    }
});
