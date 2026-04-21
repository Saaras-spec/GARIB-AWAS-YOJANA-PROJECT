document.addEventListener("DOMContentLoaded", () => {
    if (!requireRole('officer')) return;

    const defaultPosition = [20.5937, 78.9629];
    const map = L.map('map').setView(defaultPosition, 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
    }).addTo(map);

    fetch('/api/beneficiaries', { headers: authHeaders() })
        .then(res => {
            if (res.status === 401 || res.status === 403) { logout(); return; }
            return res.json();
        })
        .then(data => {
            if (!data) return;
            data.forEach(b => {
                if (b.location && b.location.coordinates) {
                    const lat = b.location.coordinates[1];
                    const lon = b.location.coordinates[0];
                    
                    const popupContent = `
                        <div>
                            <strong>${b.name}</strong><br />
                            Status: <b>${b.status}</b><br />
                            Address: ${b.address}
                        </div>
                    `;

                    L.marker([lat, lon]).addTo(map)
                        .bindPopup(popupContent);
                }
            });
        })
        .catch(err => console.error('Error fetching Map data:', err));
});
