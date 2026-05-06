document.addEventListener("DOMContentLoaded", () => {
    if (!requireRole('officer')) return;

    let allBeneficiaries = [];
    let filteredData = [];
    let deletedRecords = [];
    let undoTimeout = null;
    let currentPage = 1;
    let totalPages = 1;
    let pendingStartId = null;

    const searchInput = document.getElementById('filter-search');
    const statusSelect = document.getElementById('filter-status');
    const districtSelect = document.getElementById('filter-district');
    const incomeSelect = document.getElementById('filter-income');

    // ── Fetch with backend filtering + pagination (Feature 2) ──
    const fetchBeneficiaries = (page = 1) => {
        const params = new URLSearchParams();
        const statusVal = statusSelect.value;
        const districtVal = districtSelect.value;
        if (statusVal) params.set('status', statusVal);
        if (districtVal) params.set('district', districtVal);
        params.set('page', page);
        params.set('limit', 10);

        fetch(`/api/beneficiaries?${params.toString()}`, { headers: authHeaders() })
            .then(res => {
                if (res.status === 401 || res.status === 403) { logout(); return; }
                return res.json();
            })
            .then(data => {
                if (!data) return;
                allBeneficiaries = data.beneficiaries || [];
                currentPage = data.currentPage || 1;
                totalPages = data.totalPages || 1;
                populateDistrictDropdown(allBeneficiaries);
                applyLocalFilters();
                renderPagination();
            })
            .catch(err => console.error('Error fetching data:', err));
    };

    const populateDistrictDropdown = (data) => {
        const districts = [...new Set(
            data.map(b => b.officerId?.district).filter(Boolean)
        )].sort();
        const currentVal = districtSelect.value;
        districtSelect.innerHTML = '<option value="">All Districts</option>';
        districts.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d;
            opt.textContent = d;
            districtSelect.appendChild(opt);
        });
        districtSelect.value = currentVal;
    };

    // Local filters (search + income — done client-side since backend handles status/district)
    const applyLocalFilters = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const incomeVal = incomeSelect.value;

        filteredData = allBeneficiaries.filter(b => {
            if (searchTerm && !b.name.toLowerCase().includes(searchTerm)) return false;
            if (incomeVal) {
                if (incomeVal === '0-50000' && b.income > 50000) return false;
                if (incomeVal === '50000-100000' && (b.income <= 50000 || b.income > 100000)) return false;
                if (incomeVal === '100000+' && b.income <= 100000) return false;
            }
            return true;
        });
        renderTable(filteredData);
    };

    // Wire filter events — status/district call backend, search/income filter locally
    searchInput.addEventListener('input', applyLocalFilters);
    incomeSelect.addEventListener('change', applyLocalFilters);
    statusSelect.addEventListener('change', () => fetchBeneficiaries(1));
    districtSelect.addEventListener('change', () => fetchBeneficiaries(1));

    // ── Render table ──
    const renderTable = (data) => {
        const tbody = document.getElementById('records-body');
        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="padding: 3rem; text-align: center; color: var(--text-secondary);">No beneficiaries found.</td></tr>`;
            return;
        }

        data.forEach(b => {
            const tr = document.createElement('tr');
            let statusClass = 'status-construction';
            if (b.status === 'Completed') statusClass = 'status-completed';
            if (b.status === 'Pending') statusClass = 'status-pending';

            let actionsHtml = '';
            if (b.status === 'Pending') {
                actionsHtml += `<button class="action-btn btn-start" data-id="${b._id}" data-action="start">Start Construction</button>`;
            } else if (b.status === 'Under Construction') {
                actionsHtml += `<button class="action-btn btn-mark" onclick="updateStatus('${b._id}', 'Completed')">Mark Completed</button>`;
                actionsHtml += `<button class="action-btn btn-move" onclick="updateStatus('${b._id}', 'Pending')">Move Back</button>`;
            } else if (b.status === 'Completed') {
                actionsHtml += `<span style="color: var(--text-secondary); font-size: 0.95rem; font-style: italic; font-weight: 500;">✓ Done</span>`;
                actionsHtml += `<button class="action-btn btn-move" onclick="updateStatus('${b._id}', 'Under Construction')">Move Back</button>`;
            }
            actionsHtml += `<button class="action-btn btn-clear" data-record='${JSON.stringify(b).replace(/'/g, "&apos;")}'>Clear</button>`;

            tr.innerHTML = `
                <td class="td-name"><a href="/officer/beneficiary-detail?id=${b._id}">${b.name}</a></td>
                <td class="td-address">${b.address}</td>
                <td><span class="status-badge ${statusClass}">${b.status}</span></td>
                <td class="td-actions">${actionsHtml}</td>
            `;
            tbody.appendChild(tr);
        });

        // Wire clear buttons
        document.querySelectorAll('.btn-clear').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const record = JSON.parse(e.target.getAttribute('data-record'));
                deleteRecord(record);
            });
        });

        // Wire start construction buttons (Feature 6)
        document.querySelectorAll('[data-action="start"]').forEach(btn => {
            btn.addEventListener('click', () => {
                pendingStartId = btn.getAttribute('data-id');
                document.getElementById('date-modal').classList.add('open');
            });
        });

        lucide.createIcons();
    };

    // ── Pagination ──
    const renderPagination = () => {
        const container = document.getElementById('pagination-container');
        if (totalPages <= 1) { container.innerHTML = ''; return; }

        let html = `<button class="page-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>`;
        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        }
        html += `<button class="page-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>`;
        html += `<span class="page-info">Page ${currentPage} of ${totalPages}</span>`;
        container.innerHTML = html;
    };

    window.goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        fetchBeneficiaries(page);
    };

    // ── Feature 6: Date modal handlers ──
    document.getElementById('modal-cancel').addEventListener('click', () => {
        document.getElementById('date-modal').classList.remove('open');
        pendingStartId = null;
    });

    document.getElementById('modal-confirm').addEventListener('click', async () => {
        const dateVal = document.getElementById('expected-date-input').value;
        if (!dateVal) { alert('Please select a date'); return; }
        if (!pendingStartId) return;

        try {
            const res = await fetch(`/api/beneficiaries/${pendingStartId}/start-construction`, {
                method: 'PATCH',
                headers: authHeaders(),
                body: JSON.stringify({ expectedCompletionDate: dateVal })
            });
            if (res.ok) {
                document.getElementById('date-modal').classList.remove('open');
                pendingStartId = null;
                document.getElementById('expected-date-input').value = '';
                fetchBeneficiaries(currentPage);
            }
        } catch (err) { console.error('Start construction error:', err); }
    });

    // ── Export PDF ──
    document.getElementById('btn-export-pdf').addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(16); doc.setTextColor(0, 0, 128);
        doc.text('Garib Awas Yojana — Beneficiary Report', 14, 18);
        doc.setFontSize(9); doc.setTextColor(100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 25);
        const rows = filteredData.map(b => [b.name, b.age, b.familyMembers, `₹${b.income?.toLocaleString('en-IN') || 0}`, b.address, b.status, b.officerId?.district || '—']);
        doc.autoTable({ startY: 30, head: [['Name', 'Age', 'Family', 'Income', 'Address', 'Status', 'District']], body: rows, theme: 'grid', headStyles: { fillColor: [0, 0, 128], fontSize: 9 }, styles: { fontSize: 8, cellPadding: 3 }, alternateRowStyles: { fillColor: [248, 249, 250] } });
        doc.save('beneficiaries_report.pdf');
    });

    // ── Export Excel ──
    document.getElementById('btn-export-excel').addEventListener('click', () => {
        const exportRows = filteredData.map(b => ({ Name: b.name, Age: b.age, 'Family Members': b.familyMembers, Income: b.income, Address: b.address, Status: b.status, District: b.officerId?.district || '—' }));
        const ws = XLSX.utils.json_to_sheet(exportRows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Beneficiaries');
        XLSX.writeFile(wb, 'beneficiaries_report.xlsx');
    });

    // ── Status update ──
    window.updateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/beneficiaries/${id}/status`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ status: newStatus }) });
            if (res.status === 401 || res.status === 403) { logout(); return; }
            if (res.ok) fetchBeneficiaries(currentPage);
        } catch (error) { console.error('Failed to update status', error); }
    };

    // ── Delete & undo ──
    const deleteRecord = async (b) => {
        if (!window.confirm(`Are you sure you want to completely clear the record for ${b.name}?`)) return;
        try {
            const res = await fetch(`/api/beneficiaries/${b._id}`, { method: 'DELETE', headers: authHeaders() });
            if (res.status === 401 || res.status === 403) { logout(); return; }
            if (res.ok) { deletedRecords = [b, ...deletedRecords]; fetchBeneficiaries(currentPage); renderUndoBanner(); }
        } catch (error) { console.error('Failed to delete', error); }
    };

    const restoreSingleRecord = async (recordToRestore) => {
        try {
            const res = await fetch('/api/beneficiaries', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ name: recordToRestore.name, age: recordToRestore.age, familyMembers: recordToRestore.familyMembers, income: recordToRestore.income, address: recordToRestore.address, latitude: recordToRestore.location.coordinates[1], longitude: recordToRestore.location.coordinates[0] }) });
            if (res.ok) {
                const createdRecord = await res.json();
                if (recordToRestore.status !== 'Pending') {
                    await fetch(`/api/beneficiaries/${createdRecord._id}/status`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ status: recordToRestore.status }) });
                }
            }
        } catch (error) { console.error('Failed to restore', error); }
    };

    const renderUndoBanner = () => {
        const banner = document.getElementById('undo-banner');
        if (deletedRecords.length === 0) { banner.style.display = 'none'; return; }
        banner.style.display = 'flex';
        let text = `<strong>${deletedRecords[0].name}</strong>`;
        if (deletedRecords.length > 1) text += ` and <strong>${deletedRecords.length - 1} other(s)</strong>`;
        text += ` were cleared from Beneficiaries.`;
        document.getElementById('undo-text').innerHTML = text;
        document.getElementById('btn-undo').textContent = deletedRecords.length > 1 ? 'Undo Last' : 'Undo Action';
        const restoreAllBtn = document.getElementById('btn-restore-all');
        if (deletedRecords.length > 1) { restoreAllBtn.style.display = 'block'; restoreAllBtn.textContent = `Restore All (${deletedRecords.length})`; } else { restoreAllBtn.style.display = 'none'; }
        if (undoTimeout) clearTimeout(undoTimeout);
        undoTimeout = setTimeout(() => { deletedRecords = []; renderUndoBanner(); }, 15000);
    };

    document.getElementById('btn-undo').addEventListener('click', async () => { if (deletedRecords.length === 0) return; await restoreSingleRecord(deletedRecords[0]); deletedRecords = deletedRecords.slice(1); fetchBeneficiaries(currentPage); renderUndoBanner(); });
    document.getElementById('btn-restore-all').addEventListener('click', async () => { if (deletedRecords.length === 0) return; for (const record of deletedRecords) { await restoreSingleRecord(record); } deletedRecords = []; fetchBeneficiaries(currentPage); renderUndoBanner(); });
    document.getElementById('btn-dismiss').addEventListener('click', () => { deletedRecords = []; if (undoTimeout) clearTimeout(undoTimeout); renderUndoBanner(); });

    fetchBeneficiaries();
});
