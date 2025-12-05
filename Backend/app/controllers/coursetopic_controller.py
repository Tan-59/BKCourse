from flask import Blueprint, jsonify, request
from .. import db
from app.models.coursetopic import CourseTopic

bp = Blueprint("course_topic", __name__)

@bp.route("/", methods=["GET"])
def get_course_topics():
    rows = CourseTopic.query.all()
    return jsonify([
        {"CourseID": r.CourseID, "TopicID": r.TopicID}
        for r in rows
    ])

@bp.route("/", methods=["POST"])
def create_course_topic():
    data = request.json
    mapping = CourseTopic(
        CourseID=data["CourseID"],
        TopicID=data["TopicID"]
    )
    db.session.add(mapping)
    db.session.commit()
    return jsonify({"message": "CourseTopic created"})
