from flask import Blueprint, jsonify, request
from .. import db
from app.models.enrollment import Review
from app.models.course import Course
from datetime import datetime
from app.models.user import User

bp = Blueprint('review', __name__, url_prefix='/reviews')

@bp.route('/course/<course_id>', methods=['GET'])
def get_reviews_by_course(course_id):
    reviews = db.session.query(Review, db.func.concat(User.FirstName, ' ', User.LastName))\
        .join(User, Review.StudentID == User.UserID)\
        .filter(Review.CourseID == course_id)\
        .all()
    
    return jsonify([{
        "StudentName": name,
        "Stars": r.Stars,
        "Content": r.Content,
        "CreatedAt": r.CreatedAt.strftime("%Y-%m-%d %H:%M")
    } for r, name in reviews])

@bp.route('/', methods=['POST'])
def add_review():
    user_id = request.headers.get('X-User-ID')
    if not user_id:
        return jsonify({"message": "Chưa đăng nhập"}), 401

    data = request.get_json()
    course_id = data.get('CourseID')
    stars = data.get('Stars')
    content = data.get('Content')

    if not course_id or not stars:
        return jsonify({"message": "Thiếu dữ liệu"}), 400

    # Kiểm tra đã review chưa
    existed = Review.query.filter_by(CourseID=course_id, StudentID=user_id).first()
    if existed:
        return jsonify({"message": "Bạn đã đánh giá khóa học này rồi"}), 400

    # Tạo review
    review = Review(
        CourseID=course_id,
        StudentID=user_id,
        Stars=stars,
        Content=content
    )
    db.session.add(review)

    # Cập nhật AvgRating
    course = Course.query.get(course_id)
    if course:
        reviews = Review.query.filter_by(CourseID=course_id).all()
        if reviews:
            avg = sum(r.Stars for r in reviews) / len(reviews)
            course.AvgRating = round(avg, 2)

    db.session.commit()
    return jsonify({"message": "Đánh giá thành công"}), 201

@bp.route('/check', methods=['GET'])
def check_reviewed():
    course_id = request.args.get('course_id')
    student_id = request.args.get('student_id')
    if not course_id or not student_id:
        return jsonify({"hasReviewed": False})
    
    exists = Review.query.filter_by(CourseID=course_id, StudentID=student_id).first()
    return jsonify({"hasReviewed": bool(exists)})