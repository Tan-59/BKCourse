from flask import Blueprint, jsonify, request
from .. import db
from sqlalchemy import text, func
from app.models.enrollment import Review
from app.models.course import Course
from app.models.user import User
from datetime import datetime

bp = Blueprint('review', __name__, url_prefix='/reviews')

# ----------- GET REVIEWS BY COURSE -----------
@bp.route('/course/<course_id>', methods=['GET'])
def get_reviews_by_course(course_id):
    reviews = (
        db.session.query(
            Review,
            (User.FirstName + ' ' + User.LastName).label("StudentName")
        )
        .join(User, Review.StudentID == User.UserID)
        .filter(Review.CourseID == course_id)
        .all()
    )

    return jsonify([
        {
            "StudentName": name,
            "Stars": r.Stars,
            "Content": r.Content,
            "CreatedAt": r.CreatedAt.strftime("%Y-%m-%d %H:%M")
        }
        for r, name in reviews
    ])


# ----------- ADD REVIEW -----------
@bp.route('/', methods=['POST'])
def add_review():
    user_id = request.headers.get('X-User-ID')
    if not user_id:
        return jsonify({"message": "Chưa đăng nhập"}), 401

    data = request.json
    if not data.get("CourseID") or not data.get("Stars"):
        return jsonify({"message": "Thiếu dữ liệu"}), 400

    course_id = data["CourseID"]

    existed = Review.query.filter_by(CourseID=course_id, StudentID=user_id).first()
    if existed:
        return jsonify({"message": "Bạn đã đánh giá khóa học này rồi"}), 400

    review = Review(
        CourseID=course_id,
        StudentID=user_id,
        Stars=data["Stars"],
        Content=data.get("Content")
    )
    db.session.add(review)

    # update AvgRating
    reviews = Review.query.filter_by(CourseID=course_id).all()
    avg = sum(r.Stars for r in reviews) / len(reviews)
    course = Course.query.get(course_id)
    course.AvgRating = round(avg, 2)

    db.session.commit()

    return jsonify({"message": "Đánh giá thành công"}), 201


# ----------- CHECK IF REVIEWED -----------
@bp.route('/check', methods=['GET'])
def check_reviewed():
    course_id = request.args.get('course_id')
    student_id = request.args.get('student_id')

    if not course_id or not student_id:
        return jsonify({"hasReviewed": False})

    exists = Review.query.filter_by(CourseID=course_id, StudentID=student_id).first()
    return jsonify({"hasReviewed": bool(exists)})
