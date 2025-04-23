// Import Turf.js
const turf = require('@turf/turf');

// Titik koordinat (longitude, latitude)
const point1 = turf.point([106.8456, -6.2088]); // Jakarta
const point2 = turf.point([110.3608, -7.8014]); // Yogyakarta

// Menghitung jarak antara dua titik dalam kilometer
const distance = turf.distance(point1, point2, { units: 'miles' });

console.log(`Jarak antara Jakarta dan Yogyakarta adalah ${distance.toFixed(2)} km.`);
