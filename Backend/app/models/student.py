from .. import db

class Student(db.Model):
    __tablename__ = 'students'
    StudentID = db.Column(db.String(20), db.ForeignKey('users.UserID'), primary_key=True)
    Career = db.Column(db.String(150), nullable=False)

    enrollments = db.relationship('Enrollment', backref='student', lazy=True)
    reviews = db.relationship('Review', backref='student', lazy=True)
