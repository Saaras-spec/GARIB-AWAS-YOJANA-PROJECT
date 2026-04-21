document.addEventListener("DOMContentLoaded", () => {
    if (!requireRole('officer')) return;

    let deletedRecords = [];
    let undoTimeout = null;

    const fetchBeneficiaries = () => {
        fetch('/api/beneficiaries', { headers: authHeaders() })
            .then(res => {
                if (res.status === 401 || res.status === 403) { logout(); return; }
                return res.json();
            })
            .then(data => { if (data) renderTable(data); })
            .catch(err => console.error('Error fetching data:', err));
    };

    const renderTable = (data) => {
        const tbody = document.getElementById('records-body');
        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="padding: 3rem; text-align: center; color: var(--text-secondary);">No beneficiaries registered yet.</td></tr>`;
            return;
        }

        data.forEach(b => {
            const tr = document.createElement('tr');
            
            let statusClass = 'status-construction';
            if (b.status === 'Completed') statusClass = 'status-completed';
            if (b.status === 'Pending') statusClass = 'status-pending';

            let actionsHtml = '';
            if (b.status === 'Pending') {
                actionsHtml += `<button class="action-btn btn-start" onclick="updateStatus('${b._id}', 'Under Construction')">Start Construction</button>`;
            } else if (b.status === 'Under Construction') {
                actionsHtml += `<button class="action-btn btn-mark" onclick="updateStatus('${b._id}', 'Completed')">Mark Completed</button>`;
                actionsHtml += `<button class="action-btn btn-move" onclick="updateStatus('${b._id}', 'Pending')">Move Back</button>`;
            } else if (b.status === 'Completed') {
                actionsHtml += `<span style="color: var(--text-secondary); font-size: 0.95rem; font-style: italic; font-weight: 500;">✓ Done</span>`;
                actionsHtml += `<button class="action-btn btn-move" onclick="updateStatus('${b._id}', 'Under Construction')">Move Back</button>`;
            }

            actionsHtml += `<button class="action-btn btn-clear" data-record='${JSON.stringify(b).replace(/'/g, "&apos;")}'>Clear</button>`;

            tr.innerHTML = `
                <td class="td-name">${b.name}</td>
                <td class="td-address">${b.address}</td>
                <td><span class="status-badge ${statusClass}">${b.status}</span></td>
                <td class="td-actions">${actionsHtml}</td>
            `;

            tbody.appendChild(tr);
        });

        document.querySelectorAll('.btn-clear').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const record = JSON.parse(e.target.getAttribute('data-record'));
                deleteRecord(record);
            });
        });
    };

    window.updateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/beneficiaries/${id}/status`, {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify({ status: newStatus })
            });
            if (res.status === 401 || res.status === 403) { logout(); return; }
            if (res.ok) fetchBeneficiaries();
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const deleteRecord = async (b) => {
        if (!window.confirm(`Are you sure you want to completely clear the record for ${b.name}?`)) return;

        try {
            const res = await fetch(`/api/beneficiaries/${b._id}`, { method: 'DELETE', headers: authHeaders() });
            if (res.status === 401 || res.status === 403) { logout(); return; }
            if (res.ok) {
                deletedRecords = [b, ...deletedRecords];
                fetchBeneficiaries();
                renderUndoBanner();
            }
        } catch (error) {
            console.error('Failed to delete', error);
        }
    };

    const restoreSingleRecord = async (recordToRestore) => {
        try {
            const res = await fetch('/api/beneficiaries', {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({
                    name: recordToRestore.name,
                    age: recordToRestore.age,
                    familyMembers: recordToRestore.familyMembers,
                    income: recordToRestore.income,
                    address: recordToRestore.address,
                    latitude: recordToRestore.location.coordinates[1],
                    longitude: recordToRestore.location.coordinates[0]
                })
            });

            if (res.ok) {
                const createdRecord = await res.json();
                if (recordToRestore.status !== 'Pending') {
                    await fetch(`/api/beneficiaries/${createdRecord._id}/status`, {
                        method: 'PUT',
                        headers: authHeaders(),
                        body: JSON.stringify({ status: recordToRestore.status })
                    });
                }
            }
        } catch (error) {
            console.error('Failed to restore', error);
        }
    };

    const renderUndoBanner = () => {
        const banner = document.getElementById('undo-banner');
        if (deletedRecords.length === 0) {
            banner.style.display = 'none';
            return;
        }

        banner.style.display = 'flex';
        
        let text = `<strong>${deletedRecords[0].name}</strong>`;
        if (deletedRecords.length > 1) {
            text += ` and <strong>${deletedRecords.length - 1} other(s)</strong>`;
        }
        text += ` were cleared from Beneficiaries.`;
        
        document.getElementById('undo-text').innerHTML = text;
        document.getElementById('btn-undo').textContent = deletedRecords.length > 1 ? 'Undo Last' : 'Undo Action';
        
        const restoreAllBtn = document.getElementById('btn-restore-all');
        if (deletedRecords.length > 1) {
            restoreAllBtn.style.display = 'block';
            restoreAllBtn.textContent = `Restore All (${deletedRecords.length})`;
        } else {
            restoreAllBtn.style.display = 'none';
        }

        if (undoTimeout) clearTimeout(undoTimeout);
        undoTimeout = setTimeout(() => {
            deletedRecords = [];
            renderUndoBanner();
        }, 15000);
    };

    document.getElementById('btn-undo').addEventListener('click', async () => {
        if (deletedRecords.length === 0) return;
        await restoreSingleRecord(deletedRecords[0]);
        deletedRecords = deletedRecords.slice(1);
        fetchBeneficiaries();
        renderUndoBanner();
    });

    document.getElementById('btn-restore-all').addEventListener('click', async () => {
        if (deletedRecords.length === 0) return;
        for (const record of deletedRecords) {
            await restoreSingleRecord(record);
        }
        deletedRecords = [];
        fetchBeneficiaries();
        renderUndoBanner();
    });

    document.getElementById('btn-dismiss').addEventListener('click', () => {
        deletedRecords = [];
        if (undoTimeout) clearTimeout(undoTimeout);
        renderUndoBanner();
    });

    fetchBeneficiaries();
});
