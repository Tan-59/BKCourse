document.addEventListener("DOMContentLoaded", async () => {
    let user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.UserID) return;

    const courseLink = document.getElementById("courseLink");

    try {
        // GỌI API LẤY ĐẦY ĐỦ THÔNG TIN USER
        const res = await fetch(`/users/userinfo?userid=${user.UserID}`);
        const data = await res.json();

        if (!res.ok) throw new Error("Không thể lấy thông tin user");

        // CẬP NHẬT LẠI LOCAL STORAGE (GIỮ DỮ LIỆU ĐỒNG BỘ)
        user = {
            UserID: data.UserID,
            FirstName: data.FirstName,
            LastName: data.LastName,
            Role: data.Role
        };
        localStorage.setItem("user", JSON.stringify(user));

        // HIỆN TÊN NGƯỜI DÙNG
        document.getElementById("userName").innerText =
            `${data.LastName} ${data.FirstName}`;

        // ĐIỀU HƯỚNG THEO ROLE
        if (data.Role === "lecturer") {
            courseLink.href = "/courseLecturer";
        } else if (data.Role === "student") {
            courseLink.href = "/courseStudent";
        } else {
            courseLink.href = "/login";
        }

    } catch (err) {
        console.error("Cannot get user info:", err);
        courseLink.href = "/login";
    }
});

function logout() {
    localStorage.removeItem("user");
    window.location.href = "/login";
}
