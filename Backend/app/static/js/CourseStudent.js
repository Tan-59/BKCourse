// ===================== Data =====================
let Users = [
    { UserID: "USR0021", FullName: "Nguyễn Văn A" },
    { UserID: "USR0022", FullName: "Lê Văn B" },
    { UserID: "USR0023", FullName: "Trần Thị C" }
];

let Topics = [];
let Courses = [];
let CourseTopic = [];

// ===================== Window Load =====================
window.onload = async () => {
    await fetchTopics();
    loadVisibilitySelect();
    await fetchCourseTopics();
    await fetchCourses(); // fetch courses sau khi đã có CourseTopic

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

// ===================== Fetch Topics =====================
async function fetchTopics() {
    try {
        const res = await fetch("http://localhost:5000/topics/");
        if (!res.ok) throw new Error("Không thể load topics");
        Topics = await res.json();

        const selFilter = document.getElementById("filterTopic");
        const selNew = document.getElementById("newCourseTopic");
        Topics.forEach(t => {
            let op1 = document.createElement("option");
            op1.value = t.TopicID;
            op1.textContent = t.TopicName;
            selFilter.appendChild(op1);

            let op2 = document.createElement("option");
            op2.value = t.TopicID;
            op2.textContent = t.TopicName;
            selNew.appendChild(op2);
        });
    } catch (err) {
        console.error(err);
        alert("Lỗi khi load danh sách chủ đề!");
    }
}

// ===================== Fetch CourseTopics =====================
async function fetchCourseTopics() {
    try {
        const res = await fetch("http://localhost:5000/coursetopic/");
        if (!res.ok) throw new Error("Không thể load CourseTopic");
        CourseTopic = await res.json();
    } catch (err) {
        console.error(err);
        alert("Lỗi khi load mapping khóa học - chủ đề!");
    }
}

// ===================== Fetch Courses =====================
async function fetchCourses() {
    try {
        const res = await fetch("http://localhost:5000/courses/full");
        if (!res.ok) throw new Error("Không thể load dữ liệu khóa học từ server");
        const data = await res.json();

        Courses = data.map(c => ({
            CourseID: c.CourseID,
            CourseName: c.CourseName,
            CourseDescription: c.CourseDescription,
            LecturerID: c.LecturerID,
            AvgRating: c.AvgRating || 0,
            TotalEnrollments: c.TotalEnrollments || 0,
            CreatedDate: c.CreatedDate,
            status: c.Status || "Private"
        }));

        renderCourses(Courses);
    } catch (err) {
        console.error(err);
        alert("Lỗi khi load danh sách khóa học!");
    }
}

// ===================== Helper Functions =====================
function getTopicName(topicID) {
    const t = Topics.find(x => x.TopicID === topicID);
    return t ? t.TopicName : null;
}

function getLecturerName(userID) {
    const u = Users.find(x => x.UserID === userID);
    return u ? u.FullName : "Không rõ";
}

// ===================== Filter & Render =====================
function filterCourses() {
    const selectedTopicID = document.getElementById("filterTopic").value;
    const sortBy = document.getElementById("sortOrder").value;
    const keyword = document.getElementById("searchCourse").value.toLowerCase();

    let filtered = [...Courses];

    if (selectedTopicID !== "All") {
        const courseIDs = CourseTopic.filter(ct => ct.TopicID === selectedTopicID).map(ct => ct.CourseID);
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
async function addCourse() {
    const name = document.getElementById("newCourseName").value;
    const desc = document.getElementById("newCourseDescription").value;
    const topicName = document.getElementById("newCourseTopic").value;
    const visibility = document.getElementById("newCourseVisibility").value;
    const lecturerID = "USR0021";

    if (!name || !topicName) {
        alert("Vui lòng nhập tên khóa học và chọn chủ đề!");
        return;
    }

    const topicID = getTopicID(topicName);
    const newID = "CRS" + (Courses.length + 1).toString().padStart(3, "0");

    const payload = {
        CourseID: newID,
        CourseName: name,
        CourseDescription: desc,
        LecturerID: lecturerID,
        Status: visibility === "public" ? "Public" : "Private",
        TopicID: topicID
    };

    try {
        const res = await fetch("http://localhost:5000/courses/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Lỗi khi tạo khóa học mới");

        const data = await res.json();
        alert("Thêm khóa học thành công!");

        // thêm vào mảng cục bộ và render
        Courses.push({
            CourseID: newID,
            CourseName: name,
            CourseDescription: desc,
            LecturerID: lecturerID,
            AvgRating: 0,
            TotalEnrollments: 0,
            CreatedDate: new Date().toISOString().slice(0, 10),
            status: visibility === "public" ? "Public" : "Private"
        });

        CourseTopic.push({ CourseID: newID, TopicID: topicID });
        renderCourses(Courses);

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}
