document.addEventListener("DOMContentLoaded", () => {
    if (!requireRole('user')) return;

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
                throw new Error(data.message || 'Failed to load details');
            }
            return data;
        })
        .then(data => {
            if (!data) return;

            // Populate read-only fields exactly as in DB
            document.getElementById('name').value = data.name || '';
            document.getElementById('age').value = data.age || '';
            document.getElementById('familyMembers').value = data.familyMembers || '';
            document.getElementById('income').value = data.income || '';
            document.getElementById('address').value = data.address || '';

            lucide.createIcons();
        })
        .catch(err => {
            console.error('User Details Error:', err);
            const msgContainer = document.getElementById('message-container');
            if (msgContainer) {
                msgContainer.innerHTML = `
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                        <i data-lucide="alert-circle" style="width:18px;height:18px;"></i>
                        <span>Failed to load your information: ${err.message}</span>
                    </div>`;
                msgContainer.style.display = 'block';
                msgContainer.style.backgroundColor = 'rgba(220, 38, 38, 0.05)';
                msgContainer.style.color = 'var(--danger)';
                msgContainer.style.border = '1px solid rgba(220, 38, 38, 0.1)';
                lucide.createIcons();
            }
        });
});
