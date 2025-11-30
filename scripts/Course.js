// ===================== Data =====================
// Giả lập Users (Lecturer)
const Users = [
    { UserID: "USR0021", FullName: "Nguyễn Văn A" },
    { UserID: "USR0022", FullName: "Lê Văn B" },
    { UserID: "USR0023", FullName: "Trần Thị C" },
    { UserID: "USR0024", FullName: "Phạm Văn D" },
    { UserID: "USR0025", FullName: "Hoàng Thị E" },
    { UserID: "USR0026", FullName: "Nguyễn Văn F" }
];

// Khóa học
const Courses = [
    { 
        CourseID: "CRS001", 
        CourseName: "Python Cơ bản", 
        CourseDescription: "Khóa học lập trình Python từ con số 0 dành cho người mới bắt đầu.", 
        LecturerID: "USR0021", 
        AvgRating: 4.6, 
        TotalEnrollments: 23, 
        CreatedDate: "2024-01-15",
        status: "Đã tham gia"
    },
    { 
        CourseID: "CRS002", 
        CourseName: "Python Nâng cao", 
        CourseDescription: "Làm chủ Python với decorator, generator, multiprocessing.", 
        LecturerID: "USR0022", 
        AvgRating: 4.8, 
        TotalEnrollments: 54, 
        CreatedDate: "2024-03-10",
        status: "Chưa tham gia"
    },
    { 
        CourseID: "CRS003", 
        CourseName: "Thiết kế Web hiện đại", 
        CourseDescription: "Học HTML5, CSS3, Responsive, TailwindCSS, Flexbox/Grid.", 
        LecturerID: "USR0021", 
        AvgRating: 4.7, 
        TotalEnrollments: 15, 
        CreatedDate: "2024-02-20",
        status: "Đã tham gia"
    },
    { 
        CourseID: "CRS004", 
        CourseName: "Machine Learning từ A-Z", 
        CourseDescription: "Học máy có giám sát/không giám sát, SVM, Random Forest, Neural Network.", 
        LecturerID: "USR0025", 
        AvgRating: 4.9, 
        TotalEnrollments: 32, 
        CreatedDate: "2024-04-05",
        status: "Chưa tham gia"
    }
];

// Topics
const Topics = [
    { TopicID: "TPC001", TopicName: "Công nghệ thông tin" },
    { TopicID: "TPC002", TopicName: "Web Development" },
    { TopicID: "TPC003", TopicName: "Trí tuệ nhân tạo" },
    { TopicID: "TPC004", TopicName: "Máy học" },
    { TopicID: "TPC005", TopicName: "Thiết kế" }
];

// Mapping Course -> Topic
const CourseTopic = [
    { CourseID: "CRS001", TopicID: "TPC001" },
    { CourseID: "CRS002", TopicID: "TPC001" },
    { CourseID: "CRS003", TopicID: "TPC002" },
    { CourseID: "CRS004", TopicID: "TPC004" }
];

// ===================== Window Load =====================
window.onload = () => {
    loadTopics();
    renderCourses(Courses);

    document.getElementById("btnFilter").onclick = () => filterCourses();
    document.getElementById("searchCourse").oninput = () => filterCourses();
};

// ===================== Functions =====================

// Load topic dropdown
function loadTopics() {
    const sel = document.getElementById("filterTopic");
    Topics.forEach(t => {
        let op = document.createElement("option");
        op.value = t.TopicName;
        op.textContent = t.TopicName;
        sel.appendChild(op);
    });
}

// Get TopicID from TopicName
function getTopicID(topicName) {
    const t = Topics.find(x => x.TopicName === topicName);
    return t ? t.TopicID : null;
}

// Get Lecturer FullName
function getLecturerName(userID) {
    const u = Users.find(x => x.UserID === userID);
    return u ? u.FullName : "Không rõ";
}

// Filter and sort courses
function filterCourses() {
    const selectedTopic = document.getElementById("filterTopic").value;
    const sortBy = document.getElementById("sortOrder").value;
    const keyword = document.getElementById("searchCourse").value.toLowerCase();

    let filtered = Courses;

    // Filter by topic
    if (selectedTopic !== "All") {
        const topicID = getTopicID(selectedTopic);
        if (!topicID) {
            alert("Chủ đề không tồn tại!");
            return;
        }
        const courseIDs = CourseTopic.filter(ct => ct.TopicID === topicID).map(ct => ct.CourseID);
        filtered = filtered.filter(c => courseIDs.includes(c.CourseID));
    }

    // Filter by search keyword
    if (keyword) {
        filtered = filtered.filter(c => c.CourseName.toLowerCase().includes(keyword));
    }

    // Sort
    filtered.sort((a,b) => {
        if (sortBy === "stars") return b.AvgRating - a.AvgRating;
        if (sortBy === "enrollments") return b.TotalEnrollments - a.TotalEnrollments;
        if (sortBy === "newest") return new Date(b.CreatedDate) - new Date(a.CreatedDate);
        return 0;
    });

    renderCourses(filtered);
}

// Render course list
function renderCourses(courseArray) {
    const list = document.getElementById("courseList");
    list.innerHTML = "";

    courseArray.forEach(c => {
        let card = document.createElement("div");
        card.className = "flex flex-col gap-2 bg-white p-4 w-full rounded-md cursor-pointer shadow-md";

        // Set status color
        let statusClass = c.status === "Đã tham gia" 
            ? "bg-green-100 text-green-700 w-fit px-4 py-1 rounded-[32px] font-bold text-xs"
            : "bg-red-100 text-red-700 w-fit px-4 py-1 rounded-[32px] font-bold text-xs";

        const lecturerName = getLecturerName(c.LecturerID);

        card.innerHTML = `
            <h3 class="font-semibold text-lg pb-1 border-b border-gray-300">${c.CourseName}</h3>
            <p class="text-gray-600 text-sm">Giảng viên: ${lecturerName}</p>
            <p class="text-gray-600 text-sm">Mô tả: ${c.CourseDescription}</p>
            <p class="text-gray-600 text-sm">${c.AvgRating} <i class="fa-solid fa-star text-yellow-400 mr-1"></i> | Học viên: ${c.TotalEnrollments} | Ngày tạo: ${c.CreatedDate}</p>
        `;

        card.onclick = () => openModal(c);
        list.appendChild(card);
    });
}

// Open course modal
function openModal(course) {
    const lecturerName = getLecturerName(course.LecturerID);
    document.getElementById("modalCourseName").textContent = course.CourseName;
    document.getElementById("modalCourseDescription").textContent = course.CourseDescription;
    document.getElementById("modalLecturer").textContent = lecturerName;
    document.getElementById("modalStatus").textContent = course.status;
    document.getElementById("modalRating").textContent = course.AvgRating;
    document.getElementById("modalEnroll").textContent = course.TotalEnrollments;
    document.getElementById("modalDate").textContent = course.CreatedDate;

    document.getElementById("courseModal").classList.remove("hidden");
}

// Close modal
document.getElementById("closeModal").onclick = () => {
    document.getElementById("courseModal").classList.add("hidden");
};
