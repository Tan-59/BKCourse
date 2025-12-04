// Dữ liệu giả lập cho các khóa học của học viên để test
const studentCourses = [
    { id: 'C001', name: 'Lập trình Web Frontend cơ bản', instructor: 'ThS. Nguyễn Văn B', progress: 75, completed: false },
    { id: 'C002', name: 'Cơ sở dữ liệu nâng cao (MySQL)', instructor: 'TS. Lê Thị C', progress: 100, completed: true },
    { id: 'C003', name: 'Thiết kế giao diện người dùng (UI/UX)', instructor: 'Cô Trần D', progress: 40, completed: false },
    { id: 'C004', name: 'Cấu trúc dữ liệu và giải thuật', instructor: 'PGS. Đỗ Văn E', progress: 10, completed: false },
];

// Hàm render danh sách khóa học
function renderCourses() {
    const courseListContainer = document.getElementById('courseList');
    courseListContainer.innerHTML = ''; // Xóa nội dung cũ

    studentCourses.forEach(course => {
        // Tạo HTML cho Course Card
        const card = document.createElement('div');
        card.className = 'course-card';
        card.setAttribute('data-course-id', course.id); // Dùng để click chuyển trang chi tiết
        
        let progressColor = course.progress === 100 ? '#28a745' : '#007bff'; // Xanh lá nếu 100%, Xanh dương nếu đang học
        let progressText = course.progress === 100 ? 'Đã hoàn thành' : `Tiến độ: ${course.progress}%`;

        card.innerHTML = `
            <div class="course-info">
                <h3>${course.name}</h3>
                <p>Giảng viên: ${course.instructor}</p>
                
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${course.progress}%; background-color: ${progressColor};"></div>
                </div>
                <div class="progress-text">${progressText}</div>
            </div>
        `;

        // Thêm sự kiện click (giả lập chuyển sang trang chi tiết khóa học)
        card.addEventListener('click', () => {
            alert(`Chuyển đến trang chi tiết khóa học: ${course.name}`);
            // Thực tế: window.location.href = \`course_detail.html?id=${course.id}\`;
        });

        courseListContainer.appendChild(card);
    });
}

// Hàm cập nhật Dashboard Stats
function updateDashboardStats() {
    const coursesEnrolled = studentCourses.length;
    const coursesCompleted = studentCourses.filter(c => c.completed).length;
    
    // Tính tiến độ trung bình
    const totalProgress = studentCourses.reduce((sum, course) => sum + course.progress, 0);
    const avgProgress = coursesEnrolled > 0 ? Math.round(totalProgress / coursesEnrolled) : 0;

    // Cập nhật các thẻ Stats
    document.getElementById('coursesEnrolledCount').textContent = coursesEnrolled;
    document.getElementById('coursesCompletedCount').textContent = coursesCompleted;
    document.getElementById('avgProgress').textContent = `${avgProgress}%`;
}

// Hàm giả lập đăng xuất
function logout() {
    alert('Đăng xuất thành công!');
    // Thực tế: Xóa token, chuyển hướng về trang login
    window.location.href = 'login.html'; 
}

// Gắn hàm logout vào window để có thể gọi từ HTML
window.logout = logout;


// Khởi tạo trang khi tài liệu đã tải xong
document.addEventListener('DOMContentLoaded', () => {
    // Giả lập tên người dùng từ API hoặc localStorage
    const userName = "Nguyễn Văn A"; 
    document.getElementById('userName').textContent = userName;
    document.getElementById('welcomeName').textContent = userName;
    
    updateDashboardStats();
    renderCourses();
});