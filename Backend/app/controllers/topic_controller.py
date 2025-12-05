from flask import Blueprint, jsonify, request
from .. import db
from app.models.topic import Topic

bp = Blueprint("topic", __name__)

@bp.route("/", methods=["GET"])
def get_topics():
    topics = Topic.query.all()
    return jsonify([
        {
            "TopicID": t.TopicID,
            "TopicName": t.TopicName
        } for t in topics
    ])
