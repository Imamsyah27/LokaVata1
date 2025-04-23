const MAP_SERVICE_KEY = "67b6a6056fb80e64559cc07e"; // Ganti dengan API key MapID Anda

var map = new maplibregl.Map({
    container: 'map', // ID elemen div di Maps.html
    style: `https://basemap.mapid.io/styles/street-2d-building/style.json?key=${MAP_SERVICE_KEY}`, 
    center: [112.365651, -2.750101], // Format: [long, lat]
    zoom: 5,
    attributionControl: true 
}).addTo(map);

// Tambahkan kontrol zoom & navigasi
map.addControl(new maplibregl.NavigationControl(), 'top-left');

const carbonPrice = 15000;

const carbonDataByRegion = {
    maluku: { agc: 0, economyValue: 0 },
    banten: { agc: 0, economyValue: 0 },
    bali: { agc: 0, economyValue: 0 },
    gorontalo: { agc: 0, economyValue: 0 },
    dki_jakarta: { agc: 0, economyValue: 0 },
    bangka_belitung: { agc: 0, economyValue: 0 },
    daerah_istimewa_yogyakarta: { agc: 0, economyValue: 0 },
    jawa_barat: { agc: 0, economyValue: 0 },
    bengkulu: { agc: 0, economyValue: 0 },
    sulawesi_utara: { agc: 0, economyValue: 0 },
    jambi: { agc: 0, economyValue: 0 },
    nangroe_aceh_darussalam: { agc: 0, economyValue: 0 },
    sulawesi_barat: { agc: 0, economyValue: 0 },
    kalimantan_selatan: { agc: 0, economyValue: 0 },
    riau: { agc: 0, economyValue: 0 },
    sumatera_selatan: { agc: 0, economyValue: 0 },
    lampung: { agc: 0, economyValue: 0 },
    sulawesi_selatan: { agc: 0, economyValue: 0 },
    kalimantan_tengah: { agc: 0, economyValue: 0 },
    maluku_utara: { agc: 0, economyValue: 0 },
    jawa_tengah: { agc: 0, economyValue: 0 },
    kalimantan_barat: { agc: 0, economyValue: 0 },
    nusatenggara_barat: { agc: 0, economyValue: 0 },
    sumatera_utara: { agc: 0, economyValue: 0 },
    sumatera_barat: { agc: 0, economyValue: 0 },
    jawa_timur: { agc: 0, economyValue: 0 },
    sulawesi_tenggara: { agc: 0, economyValue: 0 },
    kepulauan_riau: { agc: 0, economyValue: 0 },
    kalimantan_timur: { agc: 0, economyValue: 0 },
    papua: { agc: 0, economyValue: 0 },
    sulawesi_tengah: { agc: 0, economyValue: 0 },
    papua_barat: { agc: 0, economyValue: 0 },
    nusatenggara_timur: { agc: 0, economyValue: 0 }
};

let currentGeoJsonLayer = null;

function getColor(agcValue) {
    return agcValue > 150 ? '#006837' :
           agcValue > 120 ? '#1a9850' :
           agcValue > 90 ? '#66bd63' :
           agcValue > 60 ? '#a6d96a' :
           agcValue > 30 ? '#d9ef8b' :
           agcValue > 10 ? '#ffffbf' :
           agcValue > 5 ? '#fee08b' :
           agcValue > 2 ? '#fdae61' :
           agcValue > 1 ? '#f46d43' :
           agcValue > 0 ? '#d73027' :
                          '#000000';
}

function addGeoJSONToMap(url, colorFunction, regionKey, layerGroup) {
    carbonDataByRegion[regionKey].agc = 0;
    carbonDataByRegion[regionKey].economyValue = 0;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const layer = L.geoJSON(data, {
                style: function (feature) {
                    return { 
                        fillColor: colorFunction(feature.properties.AGC1),
                        weight: 1,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                    };
                },
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties.AGC1) {
                        const agcValue = feature.properties.AGC1;
                        const economicValue = agcValue * carbonPrice;

                        carbonDataByRegion[regionKey].agc += agcValue;
                        carbonDataByRegion[regionKey].economyValue += economicValue;

                        layer.bindPopup(
                            `AGC: ${agcValue.toLocaleString('id-ID')} Mg/ha<br>` +
                            `Carbon Economic Value: Rp ${economicValue.toLocaleString('id-ID')}`
                        );
                    }
                }
            });
            layerGroup.addLayer(layer);
        })
        .catch(error => console.error(`Error loading the GeoJSON data from ${url}:`, error));
}

const mangroveLayerGroup = L.layerGroup().addTo(map);
const RTRWLayerGroup = L.layerGroup().addTo(map);
const areaLainnyaLayerGroup = L.layerGroup().addTo(map);

// Pastikan layer mangrove tetap di atas
map.removeLayer(RTRWLayerGroup);
map.removeLayer(areaLainnyaLayerGroup);
map.addLayer(RTRWLayerGroup);
map.addLayer(areaLainnyaLayerGroup);

const overlays = {
    "Area Mangrove": mangroveLayerGroup,
    "RTRW Provinsi": RTRWLayerGroup,
    "Area Lainnya": areaLainnyaLayerGroup
};

L.control.layers(null, overlays, { collapsed: false, position: 'topright' }).addTo(map);

function updateMap() {
    const locationSelect = document.getElementById("locationSelect");
    const selectedOption = locationSelect.options[locationSelect.selectedIndex];
    const regionKey = selectedOption.getAttribute('data-region');

    // Format file path berdasarkan region
    const mangroveUrl = `Data/AGC1_${capitalize(regionKey)}.geojson`;
    const RTRWUrl = `Data/Polaruang_${capitalize(regionKey)}.geojson`;
    const areaLainnyaUrl = `Data/Seagrass_${capitalize(regionKey)}.geojson`;

    // Bersihkan layer sebelum menambahkan data baru
    mangroveLayerGroup.clearLayers();
    RTRWLayerGroup.clearLayers();
    areaLainnyaLayerGroup.clearLayers();

    addGeoJSONToMap(mangroveUrl, getColor, regionKey, mangroveLayerGroup);
    addRTRWGeoJSON(RTRWUrl, RTRWLayerGroup);
    addGeoJSONToMap(areaLainnyaUrl, getColor, regionKey, areaLainnyaLayerGroup);
    updateOverlayTable(mangroveUrl);
}

// Fungsi untuk mengatur warna berdasarkan jenis kawasan RTRW (fill aktif)
function getRTRWStyle(feature) {
    const type = feature.properties?.Kawasan || "Lainnya";
    const colors = {
        "Kawasan Perlindungan Terhadap Kawasan Bawahannya": "#ff0000", // Merah
        "Kawasan Pencadangan Konservasi di Laut": "#ff6600", // Oranye
        "Kawasan Konservasi": "#008000", // Hijau
        "Kawasan Ekosistem Mangrove": "#006600", // Hijau tua
        "Kawasan Perlindungan Setempat": "#00ccff", // Biru muda
        "Badan Air": "#0000ff", // Biru
        "Kawasan Hutan Produksi": "#8B4513", // Coklat
        "Kawasan Peruntukan Industri": "#800080", // Ungu
        "Kawasan Transportasi": "#FFA500", // Jingga
        "Kawasan HGU dan HGB": "#FFD700", // Kuning
        "Garis Pantai": "#000000" // Hitam
    };

    return {
        color: "#000000", // Warna garis tepi hitam
        weight: 1.5, // Ketebalan garis tepi
        fillColor: colors[type] || "#CCCCCC", // Warna isi berdasarkan jenis kawasan
        fillOpacity: 0.5 // Opasitas diatur agar tidak terlalu solid
    };
}

// Fungsi untuk menambahkan data RTRW ke peta dengan warna penuh
function addRTRWGeoJSON(url, layerGroup) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: getRTRWStyle,
                onEachFeature: function (feature, layer) {
                    const type = feature.properties?.Kawasan || "Tidak Diketahui";
                    layer.bindPopup(`<strong>Jenis Kawasan:</strong> ${type}`);
                }
            }).addTo(layerGroup);
        })
        .catch(error => console.error("Gagal memuat data RTRW:", error));
}

// Fungsi untuk mengkapitalisasi huruf pertama nama region
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function moveToLocation() {
    const locationSelect = document.getElementById("locationSelect");
    const selectedOption = locationSelect.value;

    if (selectedOption) {
        const coords = selectedOption.split(',');
        const lat = parseFloat(coords[0]);
        const lng = parseFloat(coords[1]);
        const zoom = parseInt(coords[2]);

        map.flyTo({
            center: [lng, lat],
            zoom: zoom,
            essential: true
        });
        
        updateMap();
    }
}

function updateOverlayTable(geojsonUrl) {
    const tableBody = document.getElementById("overlayTableBody");
    tableBody.innerHTML = ""; // Kosongkan tabel sebelumnya

    let totalAGC = 0;
    let totalEconomicValue = 0;
    let totalArea = 0;
    const carbonPrice = 15000;

    fetch(geojsonUrl)
        .then(response => response.json())
        .then(data => {
            data.features.forEach(feature => {
                const agcValue = feature.properties?.AGC1 || 0;

                // Hitung luas menggunakan Turf.js
                const featureArea = turf.area(feature) / 10000; // Konversi ke hektar (ha)
                
                totalAGC += agcValue;
                totalArea += featureArea;
                totalEconomicValue += agcValue * carbonPrice;
            });

            const currentDate = new Date().toLocaleDateString('id-ID');

            // Tambahkan baris ringkasan ke tabel
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>Total Data</td>
                <td>${totalAGC.toLocaleString('id-ID')} Mg/ha</td>
                <td>Rp ${totalEconomicValue.toLocaleString('id-ID')}</td>
                <td>${totalArea.toFixed(2).toLocaleString('id-ID')} ha</td>
                <td>${currentDate}</td>
                <td>
                    <div class="download-buttons">
                        <button class="download-btn csv">Download CSV</button>
                        <button class="download-btn geojson">Download GeoJSON</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);

            // Tambahkan event listener untuk tombol download CSV
            row.querySelector(".download-btn.csv").addEventListener("click", downloadAGCDataAsCSV);

            // Tambahkan event listener untuk tombol download GeoJSON
            row.querySelector(".download-btn.geojson").addEventListener("click", function () {
                downloadAsGeoJSON(geojsonUrl);
            });
        })
        .catch(error => console.error(`Error loading GeoJSON data for table:`, error));
}

// Fungsi untuk mengunduh data dalam format CSV
function downloadAGCDataAsCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Keterangan,Total AGC (Mg/ha),Valuasi Ekonomi (Rp),Total Luasan (ha),Tanggal\n";

    const row = document.querySelector("#overlayTableBody tr");
    if (row) {
        let rowData = [];
        row.querySelectorAll("td:not(:last-child)").forEach(td => rowData.push(td.innerText)); // Hindari kolom tombol
        csvContent += rowData.join(",") + "\n";
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "AGC_Data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Fungsi untuk mengunduh GeoJSON secara langsung
function downloadAsGeoJSON(geojsonUrl) {
    fetch(geojsonUrl)
        .then(response => response.json())
        .then(geojson => {
            const geojsonString = JSON.stringify(geojson, null, 2); // Format JSON agar lebih rapi
            const blob = new Blob([geojsonString], { type: "application/json" });

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "AGC1_Data.geojson";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(error => console.error("Error downloading GeoJSON:", error));
}

window.addEventListener('resize', function() {
    map.invalidateSize();
});

// Add Legend
const legend = L.control({ position: 'topright' });

legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend');
    const grades = [0, 1, 2, 5, 10, 30, 60, 90, 120, 150];

    div.innerHTML = '<strong>AGC (Mg/ha)</strong><br>';

    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            `<i style="display: inline-block; width: 18px; height: 18px; background: ${getColor(grades[i] + 1)}; margin-right: 6px;"></i>` +
            `${grades[i]}${grades[i + 1] ? '&ndash;' + grades[i + 1] : '+'}<br>`;
    }

    return div;
};

legend.addTo(map);

// Koordinat awal dan zoom awal
const initialView = {
    lat: -2.750101,
    lng: 112.365651,
    zoom: 5
};

// Tambahkan kontrol reset ke peta
map.addControl(new resetControl());

function resetMap() {
    map.setView([initialView.lat, initialView.lng], initialView.zoom);
}

function zoomIn() {
map.zoomIn();
}

function zoomOut() {
map.zoomOut();
}