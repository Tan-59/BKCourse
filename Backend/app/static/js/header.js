document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    document.getElementById("userName").innerText = `${user.FirstName} ${user.LastName}`;

    const courseLink = document.getElementById("courseLink"); // lưu reference

    try {
        const res = await fetch("/user/userinfo");
        const data = await res.json();
        if (data.Role === "lecturer") {
            courseLink.href = "/courseLecturer";
        } else if (data.Role === "student") {
            courseLink.href = "/courseStudent";
        } else {
            courseLink.href = "/login"; // fallback
        }
    } catch (err) {
        console.error("Cannot get user info:", err);
        courseLink.href = "/login"; // fallback
    }
});

function logout() {
    localStorage.removeItem("user");
    window.location.href = "/login";
}
