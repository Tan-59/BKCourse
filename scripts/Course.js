const courses = [
{ id: "CRS0001", name: "Lập trình C++", desc: "Khóa học cơ bản", status: "Public", created: "2024-12-01", topics:["TP01"] },
{ id: "CRS0002", name: "Python nâng cao", desc: "Lập trình nâng cao", status: "Private", created: "2024-10-12", topics:["TP02"] }
];


const topics = [
{ id: "TP01", name: "Programming" },
{ id: "TP02", name: "AI" }
];


const contents = [
{ course: "CRS0001", title: "Giới thiệu C++", chapter: 1 },
{ course: "CRS0001", title: "Pointer", chapter: 2 },
{ course: "CRS0002", title: "Decorator Python", chapter: 1 }
];


window.onload = () => {
loadTopics();
renderCourses();
};


function loadTopics() {
const sel = document.getElementById("filterTopic");
topics.forEach(t => {
let op = document.createElement("option");
op.value = t.id;
op.textContent = t.name;
sel.appendChild(op);
});
}


function renderCourses() {
const list = document.getElementById("courseList");
list.innerHTML = "";


courses.forEach(c => {
let card = document.createElement("div");
card.className = "course-card";
card.innerHTML = `<h3>${c.name}</h3><p>${c.desc}</p><small>${c.status}</small>`;
card.onclick = () => openModal(c);
list.appendChild(card);
});
}


function openModal(course) {
document.getElementById("modalCourseName").textContent = course.name;
document.getElementById("modalCourseDescription").textContent = course.desc;
document.getElementById("modalStatus").textContent = course.status;


const ul = document.getElementById("modalContents");
ul.innerHTML = "";
contents.filter(c => c.course === course.id).forEach(ct => {
let li = document.createElement("li");
li.textContent = `${ct.chapter}. ${ct.title}`;
ul.appendChild(li);
});


document.getElementById("courseModal").classList.remove("hidden");
}


document.getElementById("closeModal").onclick = () => {
document.getElementById("courseModal").classList.add("hidden");
};