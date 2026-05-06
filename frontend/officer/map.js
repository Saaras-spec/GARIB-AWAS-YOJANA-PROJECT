document.addEventListener("DOMContentLoaded", () => {
    if (!requireRole('officer')) return;

    const defaultPosition = [20.5937, 78.9629];
    const map = L.map('map').setView(defaultPosition, 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
    }).addTo(map);

    fetch('/api/beneficiaries?limit=1000', { headers: authHeaders() })
        .then(res => {
            if (res.status === 401 || res.status === 403) { logout(); return; }
            return res.json();
        })
        .then(data => {
            if (!data) return;
            const beneficiaries = data.beneficiaries || data;
            if (!Array.isArray(beneficiaries)) return;
            beneficiaries.forEach(b => {
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

                    const status = b.status ? b.status.toLowerCase() : '';
                    let markerColor = 'blue';
                    if (status === 'pending') markerColor = 'red';
                    else if (status === 'under construction') markerColor = 'yellow';
                    else if (status === 'completed') markerColor = 'green';

                    const customIcon = L.icon({
                        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${markerColor}.png`,
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });

                    L.marker([lat, lon], { icon: customIcon }).addTo(map)
                        .bindPopup(popupContent);
                }
            });
        })
        .catch(err => console.error('Error fetching Map data:', err));
});

