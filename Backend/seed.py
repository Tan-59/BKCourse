from app import create_app, db
from app.models import User, Lecturer, Course, Topic, CourseTopic
from datetime import datetime

app = create_app()

with app.app_context():

    # ==============================
    # USERS
    # ==============================
    users_data = [
        ('alice@gmail.com',    'Alice',    'Nguyễn',   'F', '0901000001', '2000-01-01', 'hash1'),
        ('bob@gmail.com',      'Bob',      'Trần',     'M', '0901000002', '1998-05-10', 'hash2'),
        ('charlie@gmail.com',  'Charlie',  'Lê',       'M', '0901000003', '1995-12-20', 'hash3'),
        ('daisy@gmail.com',    'Daisy',    'Phạm',     'F', '0901000004', '1999-08-15', 'hash4'),
        ('mike@gmail.com',     'Mike',     'Hoàng',    'M', '0901000005', '1989-01-18', 'hash5'),
        ('kevin@gmail.com',    'Kevin',    'Trần',     'M', '0901000006', '1970-10-07', 'hash6'),
        ('ben@gmail.com',      'Ben',      'Phạm',     'M', '0901000007', '1987-07-19', 'hash7'),
        ('katy@gmail.com',     'Katy',     'Nguyễn',   'F', '0901000008', '1990-04-04', 'hash8'),
        ('jason@gmail.com',    'Jason',    'Lê',       'M', '0901000009', '2020-01-01', 'hash9'),
        ('emma@gmail.com',     'Emma',     'Nguyễn',   'F', '0901000010', '1996-02-14', 'hash10'),
        ('oliver@gmail.com',   'Oliver',   'Trần',     'M', '0901000011', '1993-03-25', 'hash11'),
        ('sophia@gmail.com',   'Sophia',   'Lê',       'F', '0901000012', '1992-11-05', 'hash12'),
        ('liam@gmail.com',     'Liam',     'Phạm',     'M', '0901000013', '1990-06-12', 'hash13'),
        ('mia@gmail.com',      'Mia',      'Hoàng',    'F', '0901000014', '1998-09-30', 'hash14'),
        ('noah@gmail.com',     'Noah',     'Nguyễn',   'M', '0901000015', '1985-07-07', 'hash15'),
        ('ava@gmail.com',      'Ava',      'Trần',     'F', '0901000016', '1991-08-21', 'hash16'),
        ('elijah@gmail.com',   'Elijah',   'Lê',       'M', '0901000017', '1988-12-02', 'hash17'),
        ('isabella@gmail.com', 'Isabella',     'Phạm',     'F', '0901000018', '1994-05-18', 'hash18'),
        ('ethan@gmail.com',    'Ethan',    'Hoàng',    'M', '0901000019', '1997-04-10', 'hash19'),
        ('grace@gmail.com',    'Grace',    'Nguyễn',   'F', '0901000020', '2001-07-25', 'hash20'),
        ('anna@gmail.com',     'Anna',     'Nguyễn',   'F', '0901000021', '1995-03-10', 'hash21'),
        ('brian@gmail.com',    'Brian',    'Trần',     'M', '0901000022', '1992-07-15', 'hash22'),
        ('carl@gmail.com',     'Carl',     'Lê',       'M', '0901000023', '1990-11-20', 'hash23'),
        ('diana@gmail.com',    'Diana',    'Phạm',     'F', '0901000024', '1997-06-12', 'hash24'),
        ('eric@gmail.com',     'Eric',     'Hoàng',    'M', '0901000025', '1993-09-30', 'hash25'),
        ('fiona@gmail.com',    'Fiona',    'Nguyễn',   'F', '0901000026', '1998-12-05', 'hash26'),
        ('george@gmail.com',   'George',   'Trần',     'M', '0901000027', '1991-05-18', 'hash27'),
        ('hannah@gmail.com',   'Hannah',   'Lê',       'F', '0901000028', '1996-01-22', 'hash28'),
        ('ian@gmail.com',      'Ian',      'Phạm',     'M', '0901000029', '1994-03-14', 'hash29'),
        ('julia@gmail.com',    'Julia',    'Hoàng',    'F', '0901000030', '1999-07-01', 'hash30'),
        ('kevin2@gmail.com',   'Kevin',    'Nguyễn',   'M', '0901000031', '1988-04-10', 'hash31'),
        ('lisa@gmail.com',     'Lisa',     'Trần',     'F', '0901000032', '1992-08-20', 'hash32'),
        ('matthew@gmail.com',  'Matthew',  'Lê',       'M', '0901000033', '1990-02-15', 'hash33'),
        ('nora@gmail.com',     'Nora',     'Phạm',     'F', '0901000034', '1997-11-28', 'hash34'),
        ('oscar@gmail.com',    'Oscar',    'Hoàng',    'M', '0901000035', '1993-05-05', 'hash35'),
        ('paula@gmail.com',    'Paula',    'Nguyễn',   'F', '0901000036', '1995-12-12', 'hash36'),
        ('quinn@gmail.com',    'Quinn',    'Trần',     'M', '0901000037', '1996-09-09', 'hash37'),
        ('rachel@gmail.com',   'Rachel',   'Lê',       'F', '0901000038', '1998-03-03', 'hash38'),
        ('steve@gmail.com',    'Steve',    'Phạm',     'M', '0901000039', '1991-06-06', 'hash39'),
        ('tina@gmail.com',     'Tina',     'Hoàng',    'F', '0901000040', '1994-10-10', 'hash40'),
    ]

    user_objects = [
        User(
            Email=u[0],
            FirstName=u[1],
            LastName=u[2],
            Gender=u[3],
            Phone=u[4],
            BirthDate=datetime.strptime(u[5], "%Y-%m-%d").date(),
            PasswordHash=u[6],
            CreatedAt=datetime.utcnow()
        )
        for u in users_data
    ]

    db.session.add_all(user_objects)
    db.session.commit()
    print("Seeded Users ✔")

    # ====================================
    # LECTURERS  – GẮN ĐÚNG VỚI USER
    # ====================================

    # Lấy 20 user cuối làm giảng viên
    lecturer_users = User.query.order_by(User.CreatedAt).all()[-20:]

    lecturer_professions = [
        'Thạc sĩ Khoa học Máy tính',
        'Giảng viên Toán – Thống kê',
        'Giảng viên Sinh học',
        'Giảng viên Python',
        'Giảng viên AI',
        'Giảng viên Thiết kế Web',
        'Giảng viên Toán cơ bản',
        'Giảng viên Hóa học',
        'Giảng viên Vật lý',
        'Giảng viên Quản trị kinh doanh',
        'Giảng viên Âm nhạc',
        'Giảng viên Ngôn ngữ Anh',
        'Giảng viên Marketing',
        'Giảng viên Robotics',
        'Giảng viên IoT',
        'Giảng viên Database',
        'Giảng viên Cloud Computing',
        'Giảng viên Machine Learning',
        'Giảng viên Blockchain',
        'Giảng viên Cybersecurity'
    ]

    lecturer_objs = [
        Lecturer(
            LecturerID=lecturer_users[i].UserID,     # 🔥 PHẢI DÙNG USERID
            Profession=lecturer_professions[i]
        )
        for i in range(len(lecturer_professions))
    ]

    db.session.add_all(lecturer_objs)
    db.session.commit()
    print("Seeded Lecturers ✔")

    # ====================================
    # COURSES — Refer tới đúng LecturerID
    # ====================================

    courses_data = [
        ('Python Cơ bản', 'Khóa học lập trình Python từ con số 0...', 0),
        ('Python Nâng cao', 'Làm chủ Python nâng cao...', 1),
        ('Kỹ thuật phần mềm', 'Clean Code, Design Patterns...', 1),
        ('Thiết kế Web hiện đại', 'HTML, CSS, Tailwind...', 0),
        ('Động vật có xương sống', 'Sinh học chuyên sâu...', 2),
        ('Python Intermediate', 'List comprehension, lambda...', 3),
        ('Machine Learning từ A-Z', 'Học máy đầy đủ...', 4),
        ('Thiết kế Web Nâng cao', 'ReactJS, Next.js...', 5),
        ('Toán học cơ bản', 'Đại số, hình học...', 6),
        ('Hóa học Hữu cơ', 'Cơ chế phản ứng...', 7),
        ('Thí nghiệm Vật lý', 'Thực hành vật lý...', 8),
        ('Sinh học 101', 'Tế bào, di truyền...', 9),
        ('Quản trị Kinh doanh', 'Chiến lược, tài chính...', 9),
        ('Lý thuyết Âm nhạc', 'Nốt nhạc, hợp âm...', 10),
        ('Tiếng Anh Giao tiếp', 'Phản xạ, từ vựng...', 11),
        ('Marketing căn bản', '4P, thương hiệu...', 12),
        ('Robotics Nâng cao', 'Lập trình robot...', 13),
        ('Thực hành IoT', 'ESP32, MQTT...', 14),
        ('Hệ quản trị CSDL', 'SQL Server, PostgreSQL...', 15),
        ('Cloud Computing Cơ bản', 'AWS/GCP/Azure...', 16),
    ]

    course_objs = []
    for name, desc, lecturer_index in courses_data:
        course_objs.append(
            Course(
                CourseName=name,
                CourseDescription=desc,
                LecturerID=lecturer_users[lecturer_index].UserID,   # 🔥 TRỎ ĐÚNG USERID
            )
        )

    db.session.add_all(course_objs)
    db.session.commit()
    print("Seeded Courses ✔")

    # ====================================
    # TOPICS — ID tự sinh → không đặt tay
    # ====================================
    topic_names = [
        'Công nghệ thông tin',
        'Y học',
        'Thiết kế',
        'Kỹ năng sống',
        'Nấu ăn',
        'Trí tuệ nhân tạo',
        'Máy học',
        'Web Development',
        'Design đồ họa',
        'Quản trị kinh doanh',
        'Sức khỏe và dinh dưỡng',
        'Âm nhạc',
        'Ngôn ngữ học',
        'Thể thao',
        'Tài chính cá nhân',
        'Blockchain',
        'Cybersecurity',
        'Cloud Computing',
        'Robotics',
        'IoT'
    ]

    topic_objs = [Topic(TopicName=t) for t in topic_names]
    db.session.add_all(topic_objs)
    db.session.commit()
    print("Seeded Topics ✔")

    # ====================================
    # COURSE-TOPIC (Nhiều – nhiều)
    # Lấy ID thực tế sau khi insert
    # ====================================

    courses = Course.query.all()
    topics = Topic.query.all()

    ct_objs = []
    for i in range(min(len(courses), len(topics))):
        ct_objs.append(
            CourseTopic(
                CourseID=courses[i].CourseID,
                TopicID=topics[i].TopicID
            )
        )

    db.session.add_all(ct_objs)
    db.session.commit()
    print("Seeded CourseTopic ✔")

    print("\n🎉 ALL DATA INSERTED SUCCESSFULLY!")
