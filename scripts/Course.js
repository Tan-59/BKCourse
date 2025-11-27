const Course = [
    { CourseId: "CRS0001", CourseName: "Lập trình C++", LecturerID: "Nguyễn Văn A", status: "Đã tham gia", CreatedAt: "2024-12-01"},
    { CourseId: "CRS0002", CourseName: "Python nâng cao", LecturerID: "Lê Văn B", status: "Chưa tham gia", CreatedAt: "2024-10-12"}
];


const Topics = [
    { TopicId: "TPC0001", TopicName: "Programming" },
    { TopicId: "TPC0002", TopicName: "AI" }
];

const CourseTopic = [
    { CourseID: "CRS0001", TopicID: "TPC0001"},
    { CourseID: "CRS0002", TopicID: "TPC0002"}
]

const Contents = [
    { ContentID: "CNT0001", CourseID: "CRS0001", ContentTitle: "Giới thiệu C++", Chapter: 1 },
    { ContentID: "CNT0002", CourseID: "CRS0001", ContentTitle: "Pointer", Chapter: 2 },
    { ContentID: "CNT0003", CourseID: "CRS0002", ContentTitle: "Decorator Python", Chapter: 1 }
];


window.onload = () => {
    loadTopics();
    renderCourses();
};

// Load dropdown filter
function loadTopics() {
    const sel = document.getElementById("filterTopic");
    Topics.forEach(t => {
        let op = document.createElement("option");
        op.value = t.TopicId;
        op.textContent = t.TopicName;
        sel.appendChild(op);
    });
}

// Lấy tên topic từ TopicID
function getTopicName(topicId) {
    const t = Topics.find(x => x.TopicId === topicId);
    return t ? t.TopicName : "Không rõ";
}

// Lấy tất cả TopicIDs của một course
function getCourseTopics(courseId) {
    return CourseTopic
        .filter(ct => ct.CourseID === courseId)
        .map(ct => ct.TopicID);
}

// Render danh sách khóa học
function renderCourses() {
    const list = document.getElementById("courseList");
    list.innerHTML = "";

    Course.forEach(c => {
        let card = document.createElement("div");
        card.className = "flex flex-col gap-2 bg-white p-4 w-[800px] rounded-md cursor-pointer shadow-md";

        // Set màu trạng thái
        let statusClass = c.status === "Đã tham gia" 
            ? "bg-green-100 text-green-700 w-fit px-4 py-2 rounded-[32px] font-bold text-xs"
            : "bg-red-100 text-red-700 w-fit px-4 py-2 rounded-[32px] font-bold text-xs";

        // Lấy danh sách topic name
        const topicNames = getCourseTopics(c.CourseId)
            .map(id => getTopicName(id))
            .join(", ");

        card.innerHTML = `
            <h3 class="font-semibold text-lg">${c.CourseName}</h3>
            <p class="text-gray-600 text-sm">Giảng viên: ${c.LecturerID}</p>
            <p class="text-gray-600 text-sm">Chủ đề: ${topicNames}</p>
            <span class="${statusClass}">${c.status}</span>
        `;

        card.onclick = () => openModal(c);
        list.appendChild(card);
    });
}

// Mở modal chi tiết khóa học
function openModal(course) {
    document.getElementById("modalCourseName").textContent = course.CourseName;
    document.getElementById("modalCourseDescription").textContent = course.LecturerID;
    document.getElementById("modalStatus").textContent = course.status;

    const ul = document.getElementById("modalContents");
    ul.innerHTML = "";

    // Lọc nội dung theo CourseID
    Contents.filter(ct => ct.CourseID === course.CourseId)
        .forEach(ct => {
            let li = document.createElement("li");
            li.textContent = `${ct.Chapter}. ${ct.ContentTitle}`;
            ul.appendChild(li);
        });

    document.getElementById("courseModal").classList.remove("hidden");
}

// Đóng modal
document.getElementById("closeModal").onclick = () => {
    document.getElementById("courseModal").classList.add("hidden");
};
