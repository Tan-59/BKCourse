from .. import db

class CourseTopic(db.Model):
    __tablename__ = "course_topic"

    CourseID = db.Column(db.String(20), db.ForeignKey("courses.CourseID"), primary_key=True)
    TopicID = db.Column(db.String(20), db.ForeignKey("topics.TopicID"), primary_key=True)