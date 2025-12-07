window.onload = () => {
    const form = document.getElementById("loginForm");

    if (!form) {
        console.error("Không tìm thấy form loginForm!");
        return;
    }

    form.onsubmit = async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        if (!email || !password) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        const payload = { email, password };

        try {
            const res = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Đăng nhập thất bại");
                return;
            }

            // Lưu thông tin user vào localStorage
            localStorage.setItem("user", JSON.stringify({
                UserID: data.UserID
            }));

            alert("Đăng nhập thành công!");

            // Điều hướng theo role
            if (data.Role === "lecturer") {
                window.location.href = "/homeLecturer";
            } else if (data.Role === "student") {
                window.location.href = "/homeStudent";
            } else {
                window.location.href = "/"; // trang mặc định nếu unknown
            }

        } catch (err) {
            console.error(err);
            alert(err.message || "Lỗi kết nối server!");
        }
    };
};
