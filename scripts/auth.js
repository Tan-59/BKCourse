document.addEventListener("DOMContentLoaded", () => {

    const API_BASE = "http://127.0.0.1:5000";   // Flask backend

    // ===================== LOGIN FORM =====================
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const data = {
                username: document.getElementById("username").value,
                password: document.getElementById("password").value
            };

            let res = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            document.getElementById("msg").innerHTML = result.message;

            if (result.success) {
                window.location.href = "../index.html"; 
            }
        });
    }

    // ===================== REGISTER FORM =====================
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            let pwd = document.getElementById("password").value;
            let confirm = document.getElementById("confirm").value;

            if (pwd !== confirm) {
                document.getElementById("msg").innerHTML = "Mật khẩu không khớp!";
                return;
            }

            const data = {
                fullname: document.getElementById("fullname").value,
                username: document.getElementById("username").value,
                email: document.getElementById("email").value,
                password: pwd
            };

            let res = await fetch(`${API_BASE}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            document.getElementById("msg").innerHTML = result.message;

            if (result.success) {
                window.location.href = "login.html";
            }
        });
    }
});
