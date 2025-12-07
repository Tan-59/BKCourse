// ===================== Biến toàn cục =====================
let Topics = [];
let CourseTopic = [];
let Courses = [];
let currentUser = null;

// ===================== Load trang =====================
document.addEventListener("DOMContentLoaded", async () => {
    loadCurrentUser();
    await Promise.all([
        fetchTopics(),
        fetchCourseTopics(),
        fetchCoursesWithEnrollStatus()
    ]);

    document.getElementById("btnFilter").onclick = filterCourses;
    document.getElementById("searchCourse").oninput = filterCourses;
});

// ===================== Lấy user từ localStorage =====================
function loadCurrentUser() {
    const userData = localStorage.getItem("user");
    if (!userData) {
        currentUser = null;
        return;
    }
    try {
        currentUser = JSON.parse(userData);
    } catch {
        currentUser = { UserID: userData };
    }
}

// ===================== Fetch Topics =====================
async function fetchTopics() {
    try {
        const res = await fetch("http://localhost:5000/topics/");
        Topics = res.ok ? await res.json() : [];
        const select = document.getElementById("filterTopic");
        select.innerHTML = '<option value="All">Tất cả chủ đề</option>';
        Topics.forEach(t => select.appendChild(new Option(t.TopicName, t.TopicID)));
    } catch (err) {
        console.error("Lỗi tải chủ đề:", err);
    }
}

// ===================== Fetch Course-Topic mapping =====================
async function fetchCourseTopics() {
    try {
        const res = await fetch("http://localhost:5000/coursetopic/");
        CourseTopic = res.ok ? await res.json() : [];
    } catch (err) {
        console.error("Lỗi tải mapping:", err);
    }
}

// ===================== Fetch chỉ khóa học Public + trạng thái tham gia & hoàn thành =====================
async function fetchCoursesWithEnrollStatus() {
    try {
        const res = await fetch("http://localhost:5000/courses/full");
        if (!res.ok) throw new Error("Không tải được khóa học");

        const rawCourses = await res.json();

        // Lấy danh sách khóa học đã tham gia với trạng thái hoàn thành
        let enrolled = {};
        if (currentUser) {
            try {
                const enrollRes = await fetch(`http://localhost:5000/enrollments/student/${currentUser.UserID}`);
                if (enrollRes.ok) {
                    const data = await enrollRes.json();
                    data.forEach(e => {
                        enrolled[e.CourseID] = {
                            isEnrolled: true,
                            isCompleted: !!e.CompletedAt
                        };
                    });
                }
            } catch (e) {
                console.warn("Không lấy được danh sách đã tham gia");
            }
        }

        // Chỉ giữ lại khóa học Public
        Courses = rawCourses
            .filter(c => c.Status === "Public")
            .map(c => ({
                CourseID: c.CourseID,
                CourseName: c.CourseName,
                CourseDescription: c.CourseDescription || "Chưa có mô tả",
                LecturerID: c.LecturerID,
                LecturerName: c.LecturerName || "Không rõ",
                AvgRating: c.AvgRating || 0,
                TotalEnrollments: c.TotalEnrollments || 0,
                CreatedDate: c.CreatedDate,
                isEnrolled: enrolled[c.CourseID]?.isEnrolled || false,
                isCompleted: enrolled[c.CourseID]?.isCompleted || false
            }));

        renderCourses(Courses);
    } catch (err) {
        alert("Lỗi tải khóa học: " + err.message);
    }
}

// ===================== Render khóa học =====================
// ===================== Render khóa học (CẬP NHẬT MỚI - CÓ TRẠNG THÁI HOÀN THÀNH) =====================
function renderCourses(courseList) {
    const container = document.getElementById("courseList");
    container.innerHTML = "";

    courseList.forEach(course => {
        const card = document.createElement("div");
        card.className = "bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200";

        // Xác định trạng thái hiển thị
        let statusBadge = "";
        let enrollButton = "";

        if (!course.isEnrolled) {
            enrollButton = `
                <button 
                    id="enroll-btn-${course.CourseID}"
                    onclick="enrollCourse('${course.CourseID}', event)"
                    class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
                    Tham gia ngay
                </button>`;
        } else if (course.isEnrolled && !course.isCompleted) {
            statusBadge = `<span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">Đang học</span>`;
            enrollButton = `
                <button disabled class="px-6 py-2.5 bg-gray-500 text-white rounded-lg font-medium cursor-not-allowed">
                    Đã tham gia
                </button>`;
        } else if (course.isCompleted) {
            statusBadge = `<span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Đã hoàn thành</span>`;
            enrollButton = `
                <button disabled class="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium cursor-not-allowed flex items-center gap-2">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                    Đã hoàn thành
                </button>`;
        }

        card.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <h3 class="text-xl font-bold text-gray-800">${course.CourseName}</h3>
                ${statusBadge}
            </div>
            
            <p class="text-sm text-gray-600 mb-2">Giảng viên: <span class="font-medium">${course.LecturerName}</span></p>
            <p class="text-sm text-gray-600 mb-4">Ngày tạo: ${course.CreatedDate}</p>

            <div class="flex gap-6 text-sm text-gray-700 mb-5">
                <span class="flex items-center gap-1">
                    <span class="text-yellow-500">Rating:</span> ${course.AvgRating.toFixed(1)}
                </span>
                <span id="enroll-count-${course.CourseID}">People: ${course.TotalEnrollments} học viên</span>
            </div>

            <div class="text-right">
                ${enrollButton}
            </div>
        `;

        // Click vào card (trừ nút) → mở modal
        card.addEventListener("click", (e) => {
            if (!e.target.closest("button")) {
                openModal(course);
            }
        });

        container.appendChild(card);
    });
}

// ===================== Tham gia khóa học - Cập nhật tức thì =====================
async function enrollCourse(courseID, event) {
    event.stopPropagation();

    if (!currentUser) {
        alert("Vui lòng đăng nhập để tham gia khóa học!");
        return;
    }

    const btn = document.getElementById(`enroll-btn-${courseID}`);
    const countSpan = document.getElementById(`enroll-count-${courseID}`);

    btn.disabled = true;
    btn.textContent = "Đang xử lý...";

    try {
        const res = await fetch("http://localhost:5000/enrollments/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-User-ID": currentUser.UserID
            },
            body: JSON.stringify({ CourseID: courseID })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Không thể tham gia khóa học");
            btn.disabled = false;
            btn.textContent = "Tham gia ngay";
            return;
        }

        // Cập nhật giao diện ngay lập tức
        btn.textContent = "Đã tham gia";
        btn.className = btn.className.replace(/bg-blue-\d+/, "bg-gray-500");
        btn.disabled = true;

        const currentCount = parseInt(countSpan.textContent.match(/\d+/)[0]);
        countSpan.textContent = `People: ${currentCount + 1} học viên`;

        // Cập nhật dữ liệu trong mảng
        const course = Courses.find(c => c.CourseID === courseID);
        if (course) {
            course.isEnrolled = true;
            course.isCompleted = false; // Mới enroll nên chưa complete
            course.TotalEnrollments += 1;
        }

        alert("Tham gia khóa học thành công!");

    } catch (err) {
        console.error(err);
        alert("Lỗi kết nối server");
        btn.disabled = false;
        btn.textContent = "Tham gia ngay";
    }
}

// ===================== HOÀN THÀNH KHÓA HỌC - CẬP NHẬT CẢ CARD VÀ MODAL =====================
async function completeCourse(courseID) {
    if (!currentUser) {
        alert("Vui lòng đăng nhập!");
        return;
    }

    const btn = document.getElementById("completeBtn");
    if (!btn) return;

    btn.disabled = true;
    btn.innerHTML = "Đang xử lý...";

    try {
        const res = await fetch("http://localhost:5000/enrollments/complete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-User-ID": currentUser.UserID
            },
            body: JSON.stringify({ CourseID: courseID })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Không thể hoàn thành khóa học");
            btn.disabled = false;
            btn.innerHTML = `Hoàn thành khóa học`;
            return;
        }

        // Cập nhật local state
        const course = Courses.find(c => c.CourseID === courseID);
        if (course) {
            course.isCompleted = true;
        }

        // Cập nhật lại toàn bộ danh sách (để hiện badge "Đã hoàn thành" ngoài card)
        renderCourses(Courses);

        // Cập nhật nút trong modal thành "Đã hoàn thành"
        const container = document.getElementById("completeBtnContainer");
        container.innerHTML = `
            <div class="w-full bg-green-100 text-green-700 font-bold py-3 rounded-lg text-center flex items-center justify-center gap-2">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                Đã hoàn thành
            </div>
        `;

        alert("Chúc mừng bạn đã hoàn thành khóa học!");

    } catch (err) {
        console.error(err);
        alert("Lỗi kết nối server");
        btn.disabled = false;
        btn.innerHTML = `Hoàn thành khóa học`;
    }
}

// ===================== Lọc & sắp xếp =====================
function filterCourses() {
    let filtered = [...Courses];

    const topicID = document.getElementById("filterTopic").value;
    if (topicID !== "All") {
        const ids = CourseTopic.filter(ct => ct.TopicID === topicID).map(ct => ct.CourseID);
        filtered = filtered.filter(c => ids.includes(c.CourseID));
    }

    const keyword = document.getElementById("searchCourse").value.toLowerCase().trim();
    if (keyword) {
        filtered = filtered.filter(c => c.CourseName.toLowerCase().includes(keyword));
    }

    const sortBy = document.getElementById("sortOrder").value;
    filtered.sort((a, b) => {
        if (sortBy === "stars") return b.AvgRating - a.AvgRating;
        if (sortBy === "enrollments") return b.TotalEnrollments - a.TotalEnrollments;
        if (sortBy === "newest") return new Date(b.CreatedDate) - new Date(a.CreatedDate);
        return 0;
    });

    renderCourses(filtered);
}

// ===================== MỞ MODAL - CẬP NHẬT NÚT HOÀN THÀNH =====================
function openModal(course) {
    // Cập nhật thông tin cơ bản
    document.getElementById("modalCourseName").textContent = course.CourseName;
    document.getElementById("modalCourseDescription").textContent = course.CourseDescription || "Chưa có mô tả";
    document.getElementById("modalLecturer").textContent = course.LecturerName;
    document.getElementById("modalRating").textContent = course.AvgRating.toFixed(1);
    document.getElementById("modalEnroll").textContent = course.TotalEnrollments;
    document.getElementById("modalDate").textContent = course.CreatedDate;

    // Quản lý nút "Hoàn thành" trong modal
    let completeBtnContainer = document.getElementById("completeBtnContainer");
    if (!completeBtnContainer) {
        completeBtnContainer = document.createElement("div");
        completeBtnContainer.id = "completeBtnContainer";
        completeBtnContainer.className = "mt-4";
        document.querySelector("#courseModal .mt-4.space-y-2").appendChild(completeBtnContainer);
    }
    completeBtnContainer.innerHTML = ""; // Xóa cũ

    if (course.isEnrolled && !course.isCompleted) {
        const btn = document.createElement("button");
        btn.id = "completeBtn";
        btn.className = "w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2";
        btn.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Hoàn thành khóa học
        `;
        btn.onclick = () => completeCourse(course.CourseID);
        completeBtnContainer.appendChild(btn);
    } else if (course.isCompleted) {
        const done = document.createElement("div");
        done.className = "w-full bg-green-100 text-green-700 font-bold py-3 rounded-lg text-center flex items-center justify-center gap-2";
        done.innerHTML = `
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            ĐÃ� hoàn thành
        `;
        completeBtnContainer.appendChild(done);
    }
    // Nếu chưa tham gia → không hiện gì

    document.getElementById("courseModal").classList.remove("hidden");
}