from .. import db

class Student(db.Model):
    __tablename__ = 'Students'

    StudentID = db.Column(db.String(20), db.ForeignKey('Users.UserID'), primary_key=True)
    Career = db.Column(db.NVARCHAR(150), nullable=True)  # Đã bỏ NOT NULL

    user = db.relationship('User', back_populates='student')
    enrollments = db.relationship('Enrollment', backref='student', lazy=True)
    reviews = db.relationship('Review', backref='student', lazy=True)