from .. import db
from sqlalchemy import text
from datetime import datetime

class Forum(db.Model):
    __tablename__ = 'Forums'

    ForumID = db.Column(db.String(20), primary_key=True,
                        server_default=text("('FRM' + RIGHT('0000' + CAST(NEXT VALUE FOR Seq_Forum AS VARCHAR(10)), 4))"))
    ForumName = db.Column(db.NVARCHAR(200), nullable=False, unique=True)
    ForumDescription = db.Column(db.NVARCHAR(500))
    UserID = db.Column(db.String(20), db.ForeignKey('Users.UserID'), nullable=False)
    CreatedAt = db.Column(db.DateTime, server_default=text('GETDATE()'))

    posts = db.relationship('Post', backref='forum', lazy=True)
    forum_topics = db.relationship('ForumTopic', back_populates='forum', lazy=True)
    forum_users = db.relationship('ForumUser', backref='forum', lazy=True)

class Post(db.Model):
    __tablename__ = 'Posts'

    PostID = db.Column(db.String(20), primary_key=True,
                       server_default=text("('PST' + RIGHT('0000' + CAST(NEXT VALUE FOR Seq_Post AS VARCHAR(10)), 4))"))
    PostTitle = db.Column(db.NVARCHAR(200), nullable=False)
    PostContent = db.Column(db.NVARCHAR(500), nullable=False)
    ForumID = db.Column(db.String(20), db.ForeignKey('Forums.ForumID'), nullable=False)
    UserID = db.Column(db.String(20), db.ForeignKey('Users.UserID'), nullable=False)
    ParentPostID = db.Column(db.String(20), db.ForeignKey('Posts.PostID'))
    CreatedAt = db.Column(db.DateTime, server_default=text('GETDATE()'))

class ForumTopic(db.Model):
    __tablename__ = 'ForumTopic'
    ForumID = db.Column(db.String(20), db.ForeignKey('Forums.ForumID'), primary_key=True)
    TopicID = db.Column(db.String(20), db.ForeignKey('Topics.TopicID'), primary_key=True)

    forum = db.relationship('Forum', back_populates='forum_topics')
    topic = db.relationship('Topic', back_populates='forum_topics')

class ForumUser(db.Model):
    __tablename__ = 'ForumUsers'
    UserID = db.Column(db.String(20), db.ForeignKey('Users.UserID'), primary_key=True)
    ForumID = db.Column(db.String(20), db.ForeignKey('Forums.ForumID'), primary_key=True)
    JoinedAt = db.Column(db.DateTime, server_default=text('GETDATE()'), nullable=False)