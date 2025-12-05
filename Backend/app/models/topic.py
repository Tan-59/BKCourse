from .. import db
from app.utils.id_generator import generate_topic_id

class Topic(db.Model):
    __tablename__ = 'topics'
    TopicID = db.Column(db.String(20), primary_key=True, default=generate_topic_id)
    TopicName = db.Column(db.String(200), nullable=False, unique=True)

    course_topics = db.relationship('CourseTopic', backref='topic', lazy=True)
    forum_topics = db.relationship('ForumTopic', backref='topic', lazy=True)
