from .. import db
from sqlalchemy import text

class Topic(db.Model):
    __tablename__ = 'Topics'

    TopicID = db.Column(db.String(20), primary_key=True,
                        server_default=text("('TOP' + RIGHT('0000' + CAST(NEXT VALUE FOR Seq_Topic AS VARCHAR(10)), 4))"))
    TopicName = db.Column(db.NVARCHAR(200), nullable=False, unique=True)

    course_topics = db.relationship('CourseTopic', back_populates='topic', lazy=True)
    forum_topics = db.relationship('ForumTopic', back_populates='topic', lazy=True)