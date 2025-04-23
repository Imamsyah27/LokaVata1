<?php
session_start();
include('config.php'); // Koneksi ke database

$message = "";
$error = "";

// Proses Registrasi User
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['register'])) {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password']; // Tidak di-hash

    // Cek apakah email sudah terdaftar di tabel users
    $check_email = "SELECT email FROM users WHERE email = ?";
    $stmt = $conn->prepare($check_email);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $message = "Email sudah terdaftar! Gunakan email lain.";
    } else {
        // Simpan data user baru ke dalam tabel users
        $sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $name, $email, $password);

        if ($stmt->execute()) {
            $message = "Pendaftaran berhasil! Silakan login.";
        } else {
            $message = "Terjadi kesalahan: " . $stmt->error;
        }
    }

    $stmt->close();
}

// Proses Login untuk User dan Admin
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['login'])) {
    $email = $_POST["email"];
    $password = $_POST["password"];

    // Cek di tabel admin_accounts
    $stmt = $conn->prepare("SELECT id, password, role FROM admin_accounts WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($admin_id, $db_password, $role);

    if ($stmt->fetch() && $password === $db_password) { // Jika cocok di admin
        $_SESSION["user_id"] = $admin_id;
        $_SESSION["role"] = "admin";
        header("Location: Home.php"); // Redirect ke dashboard admin
        exit();
    }

    $stmt->close();

    // Jika bukan admin, cek di tabel users
    $stmt = $conn->prepare("SELECT id, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($user_id, $db_password);

    if ($stmt->fetch() && $password === $db_password) { // Jika cocok di users
        $_SESSION["user_id"] = $user_id;
        $_SESSION["role"] = "user";
        header("Location: Home.php"); // Redirect ke halaman user
        exit();
    } else {
        $error = "Email atau password salah!";
    }

    $stmt->close();
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="style.css">
    <title>Login - LokaVata</title>
</head>
<body>
    <main>
        <div class="container" id="container">
            <!-- Form Sign Up -->
            <div class="form-container sign-up">
    <form action="Login.php" method="POST">
        <h1>Create Account</h1>
        <span>Create Your Account</span>
        <input type="text" name="name" placeholder="Name" required>
        <input type="email" name="email" placeholder="Email" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit" name="register">Sign Up</button>
    </form>
    <?php if (!empty($message)) echo "<p style='color:green;'>$message</p>"; ?>
</div>

            <!-- Form Sign In -->
            <div class="form-container sign-in">
                <form action="Login.php" method="POST" autocomplete="on">
                    <h1>Sign In</h1>
                    <span>Use your email password</span>

                    <input type="email" name="email" placeholder="Email" required autocomplete="username">

                    <div style="position: relative; width: 100%;">
                        <input type="password" name="password" id="loginPassword" placeholder="Password" required autocomplete="current-password" style="padding-right: 40px;">
                        <span id="toggleLoginPassword" style="
                            position: absolute;
                            top: 50%;
                            right: 15px;
                            transform: translateY(-50%);
                            cursor: pointer;
                            color: white;
                            font-size: 14px;
                            user-select: none;
                        ">👁️</span>
                    </div>

                    <a href="#">Forget Your Password?</a>
                    <button type="submit" name="login">Sign In</button>
                    <?php if (!empty($error)) : ?>
                        <div class="error-message" style="color: #ff6b6b; background-color: rgba(255, 0, 0, 0.1); padding: 10px; border-radius: 5px; margin-top: 10px; text-align: center; font-size: 14px;">
    <?= $error ?>
</div>
    <?php endif; ?>
                </form>

                <?php if (!empty($error)) echo "<p style='color:red;'>$error</p>"; ?>
            </div>

            <!-- Toggle Panels -->
            <div class="toggle-container">
                <div class="toggle">
                    <div class="toggle-panel toggle-left">
                        <h1>Welcome Back!</h1>
                        <p>Enter your personal details to use all of site features</p>
                        <button class="hidden" id="login">Sign In</button>
                    </div>
                    <div class="toggle-panel toggle-right">
                        <h1>Hello, Friend!</h1>
                        <p>Register with your personal details to use all of site features</p>
                        <button class="hidden" id="register">Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    </main>
        <script src="Login.js"></script>
</body>
</html>
