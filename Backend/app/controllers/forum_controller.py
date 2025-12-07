from flask import Blueprint, jsonify, request
from .. import db
from sqlalchemy import func, text
from app.models.forum import Forum, ForumTopic, ForumUser, Post
from datetime import datetime

bp = Blueprint('forum', __name__, url_prefix='/forums')


# ---------------- GET ALL FORUMS ----------------
@bp.route('/', methods=['GET'])
def get_forums():
    forums = Forum.query.all()
    return jsonify([
        {
            "ForumID": f.ForumID,
            "ForumName": f.ForumName,
            "UserID": f.UserID
        }
        for f in forums
    ])


# ---------------- CREATE FORUM ----------------
@bp.route('/', methods=['POST'])
def create_forum():
    data = request.json

    if not data.get('ForumName') or not data.get('UserID'):
        return jsonify({"message": "Thiếu ForumName hoặc UserID"}), 400

    forum = Forum(
        ForumName=data["ForumName"],
        UserID=data["UserID"],
        ForumDescription=data.get("ForumDescription"),
    )
    db.session.add(forum)
    db.session.commit()

    return jsonify({"message": "Forum created", "ForumID": forum.ForumID}), 201


# ---------------- FORUM STATS ----------------
@bp.route('/stats', methods=['GET'])
def get_forum_stats():
    topic_name = request.args.get('topic_name')

    # Nếu không có topic -> tự tính thống kê
    if not topic_name:
        forums = Forum.query.all()
        result = []

        for f in forums:
            total_posts = db.session.query(func.count(Post.PostID)).filter_by(ForumID=f.ForumID).scalar()
            total_users = db.session.query(func.count(ForumUser.UserID)).filter_by(ForumID=f.ForumID).scalar()

            latest_post = (
                Post.query.filter_by(ForumID=f.ForumID)
                .order_by(Post.CreatedAt.desc())
                .first()
            )

            result.append({
                "ForumID": f.ForumID,
                "ForumName": f.ForumName,
                "ForumDescription": f.ForumDescription,
                "TotalPosts": total_posts or 0,
                "TotalUsers": total_users or 0,
                "LatestPostTitle": latest_post.PostTitle if latest_post else None,
                "LatestPostDate": latest_post.CreatedAt.strftime("%Y-%m-%d") if latest_post else None,
                "CreatedAt": f.CreatedAt.strftime("%Y-%m-%d") if f.CreatedAt else None,
            })

        return jsonify(result)

    # Nếu có topic -> gọi stored function SQL Server
    query = text("SELECT * FROM dbo.fn_GetForumStatsByTopic(:topic_name)")
    rows = db.session.execute(query, {"topic_name": topic_name}).fetchall()

    return jsonify([dict(row) for row in rows])


# ---------------- GET FORUM TOPICS ----------------
@bp.route('/forumtopic', methods=['GET'])
def get_forum_topics():
    rows = ForumTopic.query.all()
    return jsonify([
        {"ForumID": r.ForumID, "TopicID": r.TopicID}
        for r in rows
    ])


# ---------------- JOIN FORUM ----------------
@bp.route('/forumuser', methods=['POST'])
def join_forum():
    user_id = request.headers.get('X-User-ID')

    if not user_id:
        return jsonify({"message": "Chưa đăng nhập!"}), 401

    data = request.json
    forum_id = data.get('ForumID')

    if not forum_id:
        return jsonify({"message": "Thiếu ForumID"}), 400

    existed = ForumUser.query.filter_by(UserID=user_id, ForumID=forum_id).first()
    if existed:
        return jsonify({"message": "Bạn đã tham gia diễn đàn này rồi!"}), 200

    join = ForumUser(
        UserID=user_id,
        ForumID=forum_id,
        JoinedAt=datetime.utcnow()
    )
    db.session.add(join)
    db.session.commit()

    return jsonify({"message": "Tham gia diễn đàn thành công!"}), 201


# ---------------- LIST FORUM USER JOINED ----------------
@bp.route('/user/<user_id>', methods=['GET'])
def get_joined_forums(user_id):
    joins = ForumUser.query.filter_by(UserID=user_id).all()
    return jsonify([{"ForumID": j.ForumID} for j in joins])
