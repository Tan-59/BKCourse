from .. import db
from app.utils.id_generator import generate_forum_id, generate_post_id

class Forum(db.Model):
    __tablename__ = 'forums'
    ForumID = db.Column(db.String(20), primary_key=True, default=generate_forum_id)
    ForumName = db.Column(db.String(200), nullable=False, unique=True)
    ForumDescription = db.Column(db.String(500))
    UserID = db.Column(db.String(20), db.ForeignKey('users.UserID'))
    CreatedAt = db.Column(db.DateTime)

    posts = db.relationship('Post', backref='forum', lazy=True)
    forum_topics = db.relationship('ForumTopic', backref='forum', lazy=True)
    forum_users = db.relationship('ForumUser', backref='forum', lazy=True)

class Post(db.Model):
    __tablename__ = 'posts'
    PostID = db.Column(db.String(20), primary_key=True, default=generate_post_id)

    PostTitle = db.Column(db.String(200), nullable=False)
    PostContent = db.Column(db.String(500), nullable=False)
    ForumID = db.Column(db.String(20), db.ForeignKey('forums.ForumID'))
    UserID = db.Column(db.String(20), db.ForeignKey('users.UserID'))
    ParentPostID = db.Column(db.String(20), db.ForeignKey('posts.PostID'))
    CreatedAt = db.Column(db.DateTime)

class ForumTopic(db.Model):
    __tablename__ = 'forum_topic'
    ForumID = db.Column(db.String(20), db.ForeignKey('forums.ForumID'), primary_key=True)
    TopicID = db.Column(db.String(20), db.ForeignKey('topics.TopicID'), primary_key=True)

class ForumUser(db.Model):
    __tablename__ = 'forum_users'
    UserID = db.Column(db.String(20), db.ForeignKey('users.UserID'), primary_key=True)
    ForumID = db.Column(db.String(20), db.ForeignKey('forums.ForumID'), primary_key=True)
    JoinedAt = db.Column(db.DateTime)
