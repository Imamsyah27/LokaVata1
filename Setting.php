<?php
require('config.php');

if (!isset($_SESSION['user_id'])) {
  header("Location: Login.php"); // Jika belum login, arahkan ke Login.php
  exit(); // Pastikan script berhenti setelah redirect
}