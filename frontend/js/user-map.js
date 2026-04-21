document.addEventListener("DOMContentLoaded", () => {
    if (!requireRole('user')) return;

    // Initialize Map
    const map = L.map('map').setView([20.5937, 78.9629], 5); // Default India view

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO'
    }).addTo(map);

    // Fetch from absolute URL with content-type validation as requested
    const API_URL = "http://localhost:5001/api/user/me";
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
                throw new Error(data.message || 'Failed to load map data');
            }
            return data;
        })
        .then(data => {
            // Safety Fix: Check if location data exists
            if (!data || !data.location || !data.location.coordinates) {
                throw new Error('Location not available');
            }

            // GeoJSON stores coordinates as [longitude, latitude]
            const [lng, lat] = data.location.coordinates;
            const position = [lat, lng]; // Leaflet expects [latitude, longitude]

            // Add marker for user's property
            const marker = L.marker(position).addTo(map);
            marker.bindPopup(`
                <div style="font-family: inherit; padding: 4px;">
                    <strong style="display:block; color: var(--navy); margin-bottom: 4px;">My Registered Property</strong>
                    <span style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">${data.address || 'Address not listed'}</span>
                </div>
            `).openPopup();

            // Center map on user's location with closer zoom
            map.setView(position, 14);

            lucide.createIcons();
        })
        .catch(err => {
            console.error('User Map Error:', err);
            const mapEl = document.getElementById('map');
            if (mapEl) {
                mapEl.innerHTML = `
                    <div style="padding: 2rem; text-align: center; color: var(--danger); font-family: inherit; background: rgba(220,38,38,0.05); height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 1rem;">
                        <i data-lucide="map-pin-off" style="width:48px;height:48px;opacity:0.5;"></i>
                        <div>
                            <div style="font-weight: 600; font-size: 1.1rem;">Failed to load location</div>
                            <div style="font-size: 0.9rem; opacity: 0.8;">${err.message}</div>
                        </div>
                    </div>`;
                lucide.createIcons();
            }
        });
});
