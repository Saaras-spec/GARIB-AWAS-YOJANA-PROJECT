document.addEventListener("DOMContentLoaded", async () => {
    if (!requireRole('officer')) return;

    // 1. Initialize Map
    const defaultPosition = [20.5937, 78.9629];
    const map = L.map('map').setView(defaultPosition, 4);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO'
    }).addTo(map);

    let currentMarker = null;
    let position = null;

    const setMarkerPosition = (lat, lng, animate = false) => {
        position = [lat, lng];
        if (currentMarker) {
            currentMarker.setLatLng(position);
        } else {
            currentMarker = L.marker(position).addTo(map);
        }
        if (animate) {
            map.flyTo(position, 11, { animate: true, duration: 1.5 });
        }
        
        document.getElementById('coordinates-info').style.display = 'block';
        document.getElementById('coordinates-text').textContent = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    };

    map.on('click', function(e) {
        setMarkerPosition(e.latlng.lat, e.latlng.lng, false);
    });

    // 2. Load History for Auto-fill
    let beneficiariesHistory = [];
    const loadHistory = async () => {
        try {
            const dbRes = await fetch('/api/beneficiaries', { headers: authHeaders() });
            let serverRecords = [];
            if (dbRes.ok) serverRecords = await dbRes.json();

            let localRecords = [];
            const stored = localStorage.getItem('beneficiaryHistory');
            if (stored) localRecords = JSON.parse(stored);

            const mergedMap = {};
            serverRecords.forEach(b => mergedMap[b.name.toLowerCase()] = b);
            localRecords.forEach(b => mergedMap[b.name.toLowerCase()] = b);

            beneficiariesHistory = Object.values(mergedMap);
        } catch (err) {
            console.error("Could not load history:", err);
        }
    };
    await loadHistory();

    // UI Message Helper
    const showMessage = (msg, type = 'error') => {
        const container = document.getElementById('message-container');
        container.textContent = msg;
        container.style.display = 'block';
        
        container.style.border = 'none';
        if (type === 'autofill') {
            container.style.backgroundColor = 'rgba(0, 122, 255, 0.1)';
            container.style.color = 'var(--primary)';
            container.style.border = '1px solid rgba(0, 122, 255, 0.3)';
        } else if (type === 'success') {
            container.style.backgroundColor = 'rgba(19, 136, 8, 0.1)';
            container.style.color = 'var(--green)';
        } else {
            container.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
            container.style.color = 'var(--danger)';
        }
    };

    // 3. Auto-fill logic on Name typing
    const nameInput = document.getElementById('name');
    nameInput.addEventListener('input', (e) => {
        const value = e.target.value.trim().toLowerCase();
        const existingRecord = beneficiariesHistory.find(b => b.name.toLowerCase() === value);

        if (existingRecord) {
            document.getElementById('age').value = existingRecord.age || '';
            document.getElementById('familyMembers').value = existingRecord.familyMembers || '';
            document.getElementById('income').value = existingRecord.income || '';
            const addressInput = document.getElementById('address');
            addressInput.value = existingRecord.address || '';
            addressInput.dispatchEvent(new Event('input'));
            
            showMessage(`✨ Auto-filled information based on previous record for ${existingRecord.name}!`, 'autofill');
        } else {
            document.getElementById('message-container').style.display = 'none';
        }
    });

    // 4. Geocoding on Address typing
    const addressInput = document.getElementById('address');
    let geocodeTimeout;
    
    addressInput.addEventListener('input', (e) => {
        const val = e.target.value;
        if (!val || val.length < 3) return;

        clearTimeout(geocodeTimeout);
        geocodeTimeout = setTimeout(() => {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.length > 0) {
                        setMarkerPosition(parseFloat(data[0].lat), parseFloat(data[0].lon), true);
                    }
                })
                .catch(err => console.error("Geocoding error:", err));
        }, 1200);
    });

    // 5. Form Submission
    const form = document.getElementById('registration-form');
    const submitBtn = document.getElementById('submit-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!position) {
            showMessage('Please select a location on the map, or wait for address to auto-locate.', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Registering...';
        document.getElementById('message-container').style.display = 'none';

        const formData = {
            name: document.getElementById('name').value,
            age: parseInt(document.getElementById('age').value, 10),
            familyMembers: parseInt(document.getElementById('familyMembers').value, 10),
            income: parseInt(document.getElementById('income').value, 10),
            address: document.getElementById('address').value,
            latitude: position[0],
            longitude: position[1]
        };

        try {
            const res = await fetch('/api/beneficiaries', {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify(formData)
            });

            if (res.status === 401 || res.status === 403) { logout(); return; }

            if (res.ok) {
                const localHistory = JSON.parse(localStorage.getItem('beneficiaryHistory') || '[]');
                const existingIndex = localHistory.findIndex(h => h.name.toLowerCase() === formData.name.toLowerCase());
                if (existingIndex > -1) {
                    localHistory[existingIndex] = formData;
                } else {
                    localHistory.push(formData);
                }
                localStorage.setItem('beneficiaryHistory', JSON.stringify(localHistory));

                showMessage('Beneficiary registered successfully!', 'success');
                form.reset();
                position = null;
                if (currentMarker) map.removeLayer(currentMarker);
                currentMarker = null;
                document.getElementById('coordinates-info').style.display = 'none';
                
                await loadHistory();
            } else {
                showMessage('Failed to register beneficiary.', 'error');
            }
        } catch (error) {
            showMessage('An error occurred while connecting to the server.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Register Beneficiary';
        }
    });
});
