window.onload = () => {
    const form = document.getElementById("registerForm");

    form.onsubmit = async (e) => {
        e.preventDefault();

        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const role = document.getElementById("role").value;

        if (!firstName || !lastName || !email || !phone || !password || !confirmPassword || !role) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Mật khẩu và xác nhận mật khẩu không trùng khớp!");
            return;
        }

        const payload = {
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Phone: phone,
            Password: password,
            Role: role
        };

        try {
            const res = await fetch("http://localhost:5000/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Đăng ký thất bại");

            alert("Đăng ký thành công!");
            form.reset();

        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };
};
