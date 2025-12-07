from flask import Blueprint, jsonify, request
from .. import db
from app.models.enrollment import Enrollment
from app.models.course import Course
from app.models.student import Student
from datetime import datetime

bp = Blueprint('enrollment', __name__, url_prefix='/enrollments')

@bp.route('/', methods=['POST'])
def enroll_course():
    user_id = request.headers.get('X-User-ID')

    if not user_id:
        return jsonify({"message": "Chưa đăng nhập!"}), 401

    student = Student.query.filter_by(StudentID=user_id).first()
    if not student:
        return jsonify({"message": "Không tìm thấy tài khoản học viên."}), 404

    data = request.get_json() or {}
    course_id = data.get('CourseID')

    if not course_id:
        return jsonify({"message": "Thiếu CourseID"}), 400

    course = Course.query.get(course_id)
    if not course:
        return jsonify({"message": "Khóa học không tồn tại"}), 404

    if course.Status != "Public":
        return jsonify({"message": "Khóa học không công khai"}), 403

    existed = Enrollment.query.filter_by(
        StudentID=user_id,
        CourseID=course_id
    ).first()

    if existed:
        return jsonify({"message": "Bạn đã tham gia khóa học này rồi!"}), 200

    unfinished = Enrollment.query.filter_by(StudentID=user_id)\
        .filter(Enrollment.CompletedAt.is_(None)).count()

    if unfinished >= 10:
        return jsonify({"message": "Bạn đã đạt giới hạn 10 khóa học chưa hoàn thành"}), 403

    enrollment = Enrollment(
        StudentID=user_id,
        CourseID=course_id,
        EnrolledAt=datetime.utcnow()
    )
    db.session.add(enrollment)

    course.TotalEnrollments = (course.TotalEnrollments or 0) + 1

    db.session.commit()

    return jsonify({"message": "Tham gia khóa học thành công!"}), 201


@bp.route('/complete', methods=['POST'])
def complete_course():
    user_id = request.headers.get('X-User-ID')

    if not user_id:
        return jsonify({"message": "Chưa đăng nhập!"}), 401

    data = request.get_json() or {}
    course_id = data.get('CourseID')

    enrollment = Enrollment.query.filter_by(
        StudentID=user_id,
        CourseID=course_id
    ).first()

    if not enrollment:
        return jsonify({"message": "Bạn chưa tham gia khóa học này"}), 404

    if enrollment.CompletedAt:
        return jsonify({"message": "Khóa học đã hoàn thành trước đó"}), 400

    enrollment.CompletedAt = datetime.utcnow()
    db.session.commit()

    return jsonify({"message": "Hoàn thành khóa học thành công!"})

@bp.route('/student/<user_id>', methods=['GET'])
def get_student_enrollments(user_id):
    enrolls = Enrollment.query.filter_by(StudentID=user_id).all()
    return jsonify([
        {
            "CourseID": e.CourseID,
            "EnrolledAt": e.EnrolledAt.isoformat() if e.EnrolledAt else None,
            "CompletedAt": e.CompletedAt.isoformat() if e.CompletedAt else None
        }
        for e in enrolls
    ])
