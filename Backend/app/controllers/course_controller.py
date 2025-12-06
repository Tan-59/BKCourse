from flask import Blueprint, jsonify, request
from .. import db
from app.models.course import Course
from app.utils.auth import lecturer_required


bp = Blueprint('course', __name__)

@bp.route('/', methods=['GET'])
def get_courses():
    courses = Course.query.all()
    return jsonify([{
        "CourseID": c.CourseID,
        "CourseName": c.CourseName,
        "Status": c.Status
    } for c in courses])

@bp.route('/', methods=['POST'])
def create_course():
    data = request.json
    course = Course(
        CourseID=data.get('CourseID'),
        CourseName=data['CourseName'],
        Status=data.get('Status', 'Public'),
        LecturerID=data.get('LecturerID')
    )
    db.session.add(course)
    db.session.commit()
    return jsonify({"message": "Course created", "CourseID": course.CourseID})

@bp.route('/full', methods=['GET'])
def get_courses_full():
    courses = Course.query.all()
    result = []

    for c in courses:
        lecturer = c.lecturer.user if c.lecturer else None

        result.append({
            "CourseID": c.CourseID,
            "CourseName": c.CourseName,
            "CourseDescription": c.CourseDescription,
            "LecturerID": c.LecturerID,
            "LecturerName": f"{lecturer.LastName} {lecturer.FirstName}" if lecturer else "Không rõ",
            "AvgRating": c.AvgRating or 0,
            "TotalEnrollments": c.TotalEnrollments or 0,
            "CreatedDate": c.CreatedDate.strftime("%Y-%m-%d"),
            "status": c.Status
        })

    return jsonify(result)

@bp.route('/create', methods=['POST'])
def create_course_full(lecturer_id):
    data = request.json

    course = Course(
        CourseID=data["CourseID"],
        CourseName=data["CourseName"],
        CourseDescription=data.get("CourseDescription"),
        LecturerID=lecturer_id,
        Status=data["Status"],
        AvgRating=0,
        TotalEnrollments=0
    )

    db.session.add(course)

    # create topic mapping
    mapping = CourseTopic(
        CourseID=data["CourseID"],
        TopicID=data["TopicID"]
    )
    db.session.add(mapping)

    db.session.commit()

    return jsonify({"message": "Course created"})