// Dữ liệu giả lập cho các khóa học của giảng viên
const teacherCourses = [
    // Đã thay đổi 'progress' thành 'completionRate' và thêm 'students'
    { id: 'C001', name: 'Lập trình Web Frontend cơ bản', students: 75, completionRate: 75, completed: false },
    { id: 'C002', name: 'Cơ sở dữ liệu nâng cao (MySQL)', students: 120, completionRate: 100, completed: true },
    { id: 'C003', name: 'Thiết kế giao diện người dùng (UI/UX)', students: 36, completionRate: 36, completed: false },
    { id: 'C004', name: 'Cấu trúc dữ liệu và giải thuật', students: 95, completionRate: 72, completed: false },
];

// Hàm render danh sách khóa học
function renderCourses() {
    const courseListContainer = document.getElementById('courseList');
    courseListContainer.innerHTML = ''; // Xóa nội dung cũ

    teacherCourses.forEach(course => {
        // Tạo HTML cho Course Card
        const card = document.createElement('div');
        card.className = 'course-card';
        card.setAttribute('data-course-id', course.id); 
        
        let progressColor = course.completionRate === 100 ? '#28a745' : '#007bff'; // Xanh lá nếu 100%, Xanh dương nếu đang học
        let progressText = course.completionRate === 100 ? 'Đã hoàn thành' : `Tỷ lệ hoàn thành: ${course.completionRate}%`; // Cập nhật nhãn

        card.innerHTML = `
            <div class="course-info">
                <h3>${course.name}</h3>
                <p>Số học viên: ${course.students}</p> 
                
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${course.completionRate}%; background-color: ${progressColor};"></div>
                </div>
                <div class="progress-text">${progressText}</div>
            </div>
        `;

        // Thêm sự kiện click (giả lập chuyển sang trang quản lý chi tiết khóa học)
        card.addEventListener('click', () => {
            alert(`Chuyển đến trang quản lý khóa học: ${course.name}`);
            // Thực tế: window.location.href = \`manage_course_detail.html?id=${course.id}\`;
        });

        courseListContainer.appendChild(card);
    });
}

// Hàm cập nhật Dashboard Stats
function updateDashboardStats() {
    const coursesEnrolled = teacherCourses.length;
    // Thay đổi: Tính tổng số học viên
    const totalStudents = teacherCourses.reduce((sum, course) => sum + course.students, 0);
    
    // Tính tỷ lệ hoàn thành trung bình
    const totalCompletionRate = teacherCourses.reduce((sum, course) => sum + course.completionRate, 0);
    const avgCompletionRate = coursesEnrolled > 0 ? Math.round(totalCompletionRate / coursesEnrolled) : 0;

    // Cập nhật các thẻ Stats
    document.getElementById('coursesEnrolledCount').textContent = coursesEnrolled;
    document.getElementById('coursesCompletedCount').textContent = totalStudents; // Cập nhật nhãn
    document.getElementById('avgProgress').textContent = `${avgCompletionRate}%`; // Cập nhật nhãn
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
    const userName = "Nguyễn Văn B"; 
    document.getElementById('userName').textContent = userName;
    document.getElementById('welcomeName').textContent = userName;
    
    updateDashboardStats();
    renderCourses();
});
