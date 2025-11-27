const courses = [
    {
        id: "CS101",
        name: "Lập trình C++",
        students: 145,
        lectures: 36,
        duration: "12 tuần",
        startDate: "01/09/2024",
        progress: 65,
        status: "Đang diễn ra"
    },
    {
        id: "CS405",
        name: "Python Nâng Cao",
        students: 167,
        lectures: 24,
        duration: "8 tuần",
        startDate: "15/06/2024",
        progress: 100,
        status: "Đã hoàn thành"
    }
];

function renderTable() {
    const tableBody = document.getElementById('course-table-body');
    tableBody.innerHTML = '';

    courses.forEach(course => {
        const row = `
            <tr>
                <td>${course.id}</td>
                <td><strong>${course.name}</strong></td>
                <td>${course.students}</td>
                <td>${course.lectures}</td>
                <td>${course.duration}</td>
                <td>${course.startDate}</td>
                <td>
                    <div class="progress-wrapper">
                        <div class="progress-bg">
                            <div class="progress-fill" style="width: ${course.progress}%"></div>
                        </div>
                        <span class="progress-text">${course.progress}%</span>
                    </div>
                </td>
                <td>
                    <span class="badge">${course.status}</span>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

document.addEventListener('DOMContentLoaded', renderTable);