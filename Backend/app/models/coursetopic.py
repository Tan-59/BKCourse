from .. import db

class CourseTopic(db.Model):
    __tablename__ = 'CourseTopic'

    CourseID = db.Column(db.String(20), db.ForeignKey('Courses.CourseID'), primary_key=True)
    TopicID = db.Column(db.String(20), db.ForeignKey('Topics.TopicID'), primary_key=True)

    course = db.relationship('Course', back_populates='topics')
    topic = db.relationship('Topic', back_populates='course_topics')