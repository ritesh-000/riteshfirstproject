const map = new maplibregl.Map({
    container: 'map',

    style: `https://api.maptiler.com/maps/streets/style.json?key=${mapToken}`,

    center: coordinates, // [lng, lat]
    zoom: 9
});
// ✅ Create popup
const popup = new maplibregl.Popup({ offset: 25 })
    .setHTML(`<h6>Location</h6><p>${coordinates[1]}, ${coordinates[0]}</p>`);

// add marker
new maplibregl.Marker()
    .setLngLat(coordinates)
    .setPopup(popup) // 🔥 attach popup
    .addTo(map);
