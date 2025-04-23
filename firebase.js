  // Pastikan Firebase di-load sebelum inisialisasi
  document.addEventListener("DOMContentLoaded", function () {
    console.log("Memulai inisialisasi Firebase...");

    // Cek apakah Firebase tersedia
    if (typeof firebase === "undefined") {
      console.error("Firebase SDK gagal dimuat!");
      return;
    }


const firebaseConfig = {
    apiKey: "AIzaSyA_PJUP9NswsvAPRFDEUIAGE9a8xi1qe_U",
    authDomain: "lokavata-30558.firebaseapp.com",
    projectId: "lokavata-30558",
    storageBucket: "lokavata-30558.firebasestorage.app",
    messagingSenderId: "961692456335",
    appId: "1:961692456335:web:d95b61455534a5c9f2a7fa",
    measurementId: "G-JBNSB9RTC1"
};

  // Inisialisasi Firebase hanya jika belum ada instance
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  // Simpan Firestore sebagai variabel global agar bisa diakses di Maps.js
  window.db = firebase.firestore();
  console.log("Firebase berhasil diinisialisasi.");
});