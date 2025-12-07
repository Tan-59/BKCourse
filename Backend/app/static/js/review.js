// static/js/review.js ← FILE MỚI – CHỈ CHỨA REVIEW + GHI ĐÈ AN TOÀN

let currentCourseID = null;

function safeGet(variable, fallback) {
    try { return variable ?? fallback; }
    catch { return fallback; }
}

// Load danh sách review
async function loadReviews(courseID) {
    try {
        const res = await fetch(`http://localhost:5000/reviews/course/${courseID}`);
        if (!res.ok) throw new Error("Không tải được đánh giá");
        const reviews = await res.json();

        const container = document.getElementById("reviewsList");
        const count = document.getElementById("reviewCount");
        count.textContent = reviews.length;

        if (reviews.length === 0) {
            container.innerHTML = "<p class='text-gray-500'>Chưa có đánh giá nào.</p>";
            return;
        }

        container.innerHTML = reviews.map(r => `
            <div class="bg-gray-50 p-4 rounded-lg border mb-4">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-3">
                        <span class="font-bold">${r.StudentName || "Ẩn danh"}</span>
                        <div class="flex text-yellow-500 text-lg">
                            ${"★".repeat(r.Stars)}${"☆".repeat(5 - r.Stars)}
                        </div>
                    </div>
                    <span class="text-sm text-gray-500">
                        ${new Date(r.CreatedAt).toLocaleDateString("vi-VN")}
                    </span>
                </div>
                <p class="text-gray-700">${r.Content || "(Không có nội dung)"}</p>
            </div>
        `).join("");

    } catch (err) {
        console.error(err);
        document.getElementById("reviewsList").innerHTML = "<p class='text-red-500'>Lỗi tải đánh giá</p>";
    }
}

// Kiểm tra đã review chưa
async function checkIfReviewed(courseID) {
    const u = safeGet(currentUser, null);
    if (!u) return;

    try {
        const res = await fetch(`http://localhost:5000/reviews/check?course_id=${courseID}&student_id=${u.UserID}`);
        const data = await res.json();
        if (data.hasReviewed) {
            document.getElementById("reviewFormContainer").innerHTML =
                `<p class="text-green-600 font-medium">Bạn đã đánh giá khóa học này rồi!</p>`;
        }
    } catch (err) {
        console.error(err);
    }
}

// Setup sao + submit review
function setupStarRating() {
    let selectedStars = 0;
    const stars = document.querySelectorAll("#starRating .star");

    stars.forEach(star => {
        star.onclick = () => {
            selectedStars = parseInt(star.dataset.value);
            stars.forEach((s, i) => s.style.color = i < selectedStars ? "#fbbf24" : "#d1d5db");
        };
    });

    document.getElementById("submitReview").onclick = async () => {
        const u = safeGet(currentUser, null);
        if (!u) return alert("Bạn chưa đăng nhập!");
        if (selectedStars === 0) return alert("Vui lòng chọn số sao!");

        const content = document.getElementById("reviewContent").value.trim();

        try {
            const res = await fetch("http://localhost:5000/reviews/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-User-ID": u.UserID
                },
                body: JSON.stringify({
                    CourseID: currentCourseID,
                    Stars: selectedStars,
                    Content: content || null
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Lỗi gửi đánh giá");
            }

            alert("Cảm ơn bạn đã đánh giá!");
            await updateCourseRating(currentCourseID);
            await loadReviews(currentCourseID);
            document.getElementById("reviewFormContainer").innerHTML =
                `<p class="text-green-600 font-medium">Cảm ơn bạn đã đánh giá!</p>`;

        } catch (err) {
            alert(err.message);
        }
    };
}

// Cập nhật lại rating sau khi review
async function updateCourseRating(courseID) {
    try {
        const res = await fetch(`http://localhost:5000/courses/${courseID}`);
        if (!res.ok) return;
        const course = await res.json();

        const idx = Courses.findIndex(c => c.CourseID === courseID);
        if (idx !== -1) {
            Courses[idx].AvgRating = course.AvgRating || 0;
            renderCourses(Courses);
        }
        document.getElementById("modalRating").textContent = (course.AvgRating || 0).toFixed(1);
    } catch (err) {
        console.error(err);
    }
}

// ==================== MỞ RỘNG MODAL VỚI REVIEW ====================
async function openModalWithReview(course) {
    currentCourseID = course.CourseID;

    // Cập nhật modal info
    document.getElementById("modalCourseName").textContent = course.CourseName;
    document.getElementById("modalCourseDescription").textContent = course.CourseDescription || "";
    document.getElementById("modalLecturer").textContent = course.LecturerName;
    document.getElementById("modalRating").textContent = course.AvgRating.toFixed(1);
    document.getElementById("modalEnroll").textContent = course.TotalEnrollments;
    document.getElementById("modalDate").textContent = course.CreatedDate;

    const reviewForm = document.getElementById("reviewFormContainer");

    if (course.isEnrolled && currentUser) {
        reviewForm.classList.remove("hidden");

        // 🔹 Reset form trước khi load review
        reviewForm.innerHTML = `
            <div id="starRating" class="flex gap-1 mb-2">
                <span class="star cursor-pointer text-2xl" data-value="1">★</span>
                <span class="star cursor-pointer text-2xl" data-value="2">★</span>
                <span class="star cursor-pointer text-2xl" data-value="3">★</span>
                <span class="star cursor-pointer text-2xl" data-value="4">★</span>
                <span class="star cursor-pointer text-2xl" data-value="5">★</span>
            </div>
            <textarea id="reviewContent" class="w-full border p-2 mb-2" placeholder="Viết đánh giá..."></textarea>
            <button id="submitReview" class="bg-blue-600 text-white px-4 py-2 rounded">Gửi đánh giá</button>
        `;

        await loadReviews(course.CourseID);
        await checkIfReviewed(course.CourseID);
        setupStarRating();
    } else {
        reviewForm.classList.add("hidden");
        document.getElementById("reviewsList").innerHTML =
            "<p class='text-gray-500'>Bạn cần tham gia khóa học để xem và đánh giá.</p>";
    }
}

// ==================== GHI ĐÈ AN TOÀN + ANIMATION MODAL ====================
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("courseModal");
    const modalContent = modal.querySelector(".max-w-4xl");

    // Animation đóng modal
    document.getElementById("closeModal").onclick = () => {
        modalContent.classList.add("scale-95", "opacity-0");
        setTimeout(() => modal.classList.add("hidden"), 200);
    };

    // Ghi đè openModal cuối cùng (sau khi file gốc đã chạy)
    if (typeof window.openModal === "function") {
        const originalOpenModal = window.openModal;
        window.openModal = function(course) {
            originalOpenModal(course);        // gọi hàm gốc → render course list vẫn hoạt động
            openModalWithReview(course);       // thêm phần review
            // Animation mở
            modal.classList.remove("hidden");
            modalContent.classList.remove("scale-95", "opacity-0");
            modalContent.classList.add("scale-100", "opacity-100");
        };
    }
});