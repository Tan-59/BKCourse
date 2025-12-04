from flask import Blueprint, jsonify, request
from .. import db
from app.models.forum import Forum

bp = Blueprint('forum', __name__)

@bp.route('/', methods=['GET'])
def get_forums():
    forums = Forum.query.all()
    return jsonify([{
        "ForumID": f.ForumID,
        "ForumName": f.ForumName,
        "UserID": f.UserID
    } for f in forums])

@bp.route('/', methods=['POST'])
def create_forum():
    data = request.json
    forum = Forum(
        ForumID=data.get('ForumID'),
        ForumName=data['ForumName'],
        UserID=data['UserID']
    )
    db.session.add(forum)
    db.session.commit()
    return jsonify({"message": "Forum created", "ForumID": forum.ForumID})
