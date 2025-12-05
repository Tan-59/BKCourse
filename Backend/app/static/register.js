window.onload = () => {
    const form = document.getElementById("registerForm");

    form.onsubmit = async (e) => {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const role = document.getElementById("role").value;

        if (!fullName || !email || !phone || !username || !password || !confirmPassword || !role) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Mật khẩu và xác nhận mật khẩu không trùng khớp!");
            return;
        }

        // tách họ và tên
        const nameParts = fullName.split(" ");
        const firstName = nameParts.pop();
        const lastName = nameParts.join(" ") || firstName;

        const payload = {
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Phone: phone,
            Username: username,
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
