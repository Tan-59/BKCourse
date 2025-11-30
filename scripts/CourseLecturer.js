// ===================== Data =====================
const Users = [
    { UserID: "USR0021", FullName: "Nguyễn Văn A" },
    { UserID: "USR0022", FullName: "Lê Văn B" },
    { UserID: "USR0023", FullName: "Trần Thị C" }
];

const Topics = [
    { TopicID: "TPC001", TopicName: "Công nghệ thông tin" },
    { TopicID: "TPC002", TopicName: "Web Development" },
    { TopicID: "TPC003", TopicName: "Trí tuệ nhân tạo" }
];

const Courses = [
    { CourseID: "CRS001", CourseName: "Python Cơ bản", LecturerID: "USR0021", AvgRating: 4.6, TotalEnrollments: 23, CreatedDate: "2024-01-15", status: "Public" },
    { CourseID: "CRS002", CourseName: "Python Nâng cao", LecturerID: "USR0022", AvgRating: 4.8, TotalEnrollments: 54, CreatedDate: "2024-03-10", status: "Private" }
];

const CourseTopic = [
    { CourseID: "CRS001", TopicID: "TPC001" },
    { CourseID: "CRS002", TopicID: "TPC001" }
];

// ===================== Window Load =====================
window.onload = () => {
    loadTopics();
    loadVisibilitySelect();
    renderCourses(Courses);

    document.getElementById("btnFilter").onclick = () => filterCourses();
    document.getElementById("searchCourse").oninput = () => filterCourses();
    document.getElementById("btnAddCourse").onclick = () => addCourse();
};

// ===================== Load Visibility Select =====================
function loadVisibilitySelect() {
    const sel = document.getElementById("newCourseVisibility");
    sel.innerHTML = `
        <option value="public">Public</option>
        <option value="private">Private</option>
    `;
}

// ===================== Functions =====================
function loadTopics() {
    const selFilter = document.getElementById("filterTopic");
    const selNew = document.getElementById("newCourseTopic");
    Topics.forEach(t => {
        let op1 = document.createElement("option");
        op1.value = t.TopicName;
        op1.textContent = t.TopicName;
        selFilter.appendChild(op1);

        let op2 = document.createElement("option");
        op2.value = t.TopicName;
        op2.textContent = t.TopicName;
        selNew.appendChild(op2);
    });
}

function getTopicID(topicName) {
    const t = Topics.find(x => x.TopicName === topicName);
    return t ? t.TopicID : null;
}

function getLecturerName(userID) {
    const u = Users.find(x => x.UserID === userID);
    return u ? u.FullName : "Không rõ";
}

function filterCourses() {
    const selectedTopic = document.getElementById("filterTopic").value;
    const sortBy = document.getElementById("sortOrder").value;
    const keyword = document.getElementById("searchCourse").value.toLowerCase();

    let filtered = [...Courses];

    if (selectedTopic !== "All") {
        const topicID = getTopicID(selectedTopic);
        const courseIDs = CourseTopic.filter(ct => ct.TopicID === topicID).map(ct => ct.CourseID);
        filtered = filtered.filter(c => courseIDs.includes(c.CourseID));
    }

    if (keyword) {
        filtered = filtered.filter(c => c.CourseName.toLowerCase().includes(keyword));
    }

    filtered.sort((a, b) => {
        if (sortBy === "stars") return b.AvgRating - a.AvgRating;
        if (sortBy === "enrollments") return b.TotalEnrollments - a.TotalEnrollments;
        if (sortBy === "newest") return new Date(b.CreatedDate) - new Date(a.CreatedDate);
        return 0;
    });

    renderCourses(filtered);
}

function renderCourses(courseArray) {
    const list = document.getElementById("courseList");
    list.innerHTML = "";

    courseArray.forEach(c => {
        let card = document.createElement("div");
        card.className = "flex flex-col gap-2 bg-white p-4 w-full rounded-md cursor-pointer shadow-md";

        let statusClass =
            c.status === "Public"
                ? "bg-green-100 text-green-700 w-fit px-4 py-1 rounded-[32px] font-bold text-xs"
                : "bg-orange-100 text-orange-700 w-fit px-4 py-1 rounded-[32px] font-bold text-xs";

        const lecturerName = getLecturerName(c.LecturerID);

        card.innerHTML = `
            <h3 class="font-semibold text-lg pb-1 border-b border-gray-300">${c.CourseName}</h3>
            <p class="text-gray-600 text-sm">Giảng viên: ${lecturerName}</p>
            <p class="text-gray-600 text-sm">Ngày tạo: ${c.CreatedDate}</p>
            <p class="${statusClass}">${c.status}</p>
        `;

        card.onclick = () => openModal(c);
        list.appendChild(card);
    });
}

function openModal(course) {
    const lecturerName = getLecturerName(course.LecturerID);
    document.getElementById("modalCourseName").textContent = course.CourseName;
    document.getElementById("modalCourseDescription").textContent = course.CourseDescription || "";
    document.getElementById("modalLecturer").textContent = lecturerName;
    document.getElementById("modalStatus").textContent = course.status;
    document.getElementById("modalRating").textContent = course.AvgRating || "-";
    document.getElementById("modalEnroll").textContent = course.TotalEnrollments || "-";
    document.getElementById("modalDate").textContent = course.CreatedDate || "-";

    document.getElementById("courseModal").classList.remove("hidden");
}

// ===================== Add Course =====================
function addCourse() {
    const name = document.getElementById("newCourseName").value;
    const desc = document.getElementById("newCourseDescription").value;
    const topicName = document.getElementById("newCourseTopic").value;
    const visibility = document.getElementById("newCourseVisibility").value;
    const lecturerID = "USR0021";

    if (!name || !topicName) {
        alert("Vui lòng nhập tên khóa học và chọn chủ đề!");
        return;
    }

    const newID = "CRS" + (Courses.length + 1).toString().padStart(3, "0");

    Courses.push({
        CourseID: newID,
        CourseName: name,
        CourseDescription: desc,
        LecturerID: lecturerID,
        AvgRating: 0,
        TotalEnrollments: 0,
        CreatedDate: new Date().toISOString().slice(0, 10),

        // ⭐ Trạng thái từ select
        status: visibility === "public" ? "Public" : "Private"
    });

    CourseTopic.push({ CourseID: newID, TopicID: getTopicID(topicName) });

    renderCourses(Courses);
    alert("Thêm khóa học thành công!");
}
