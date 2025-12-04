from .. import db

class Course(db.Model):
    __tablename__ = 'courses'
    CourseID = db.Column(db.String(20), primary_key=True)
    CourseName = db.Column(db.String(200), nullable=False)
    CourseDescription = db.Column(db.String(500))
    Status = db.Column(db.String(50), nullable=False, default='Public')
    LecturerID = db.Column(db.String(20), db.ForeignKey('lecturers.LecturerID'))
    CreatedDate = db.Column(db.Date)

    contents = db.relationship('Content', backref='course', lazy=True)
    enrollments = db.relationship('Enrollment', backref='course', lazy=True)
    reviews = db.relationship('Review', backref='course', lazy=True)
    topics = db.relationship('CourseTopic', backref='course', lazy=True)
