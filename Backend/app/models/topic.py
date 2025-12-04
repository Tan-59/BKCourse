from .. import db

class Topic(db.Model):
    __tablename__ = 'topics'
    TopicID = db.Column(db.String(20), primary_key=True)
    TopicName = db.Column(db.String(200), nullable=False, unique=True)

    course_topics = db.relationship('CourseTopic', backref='topic', lazy=True)
    forum_topics = db.relationship('ForumTopic', backref='topic', lazy=True)
