from .. import db
from sqlalchemy import text

class Course(db.Model):
    __tablename__ = 'Courses'

    CourseID = db.Column(db.String(20), primary_key=True,
                         server_default=text("('CRS' + RIGHT('0000' + CAST(NEXT VALUE FOR Seq_Course AS VARCHAR(10)), 4))"))
    CourseName = db.Column(db.NVARCHAR(200), nullable=False)
    CourseDescription = db.Column(db.NVARCHAR(500))
    Status = db.Column(db.NVARCHAR(50), nullable=False, server_default=text("'Public'"))
    LecturerID = db.Column(db.String(20), db.ForeignKey('Lecturers.LecturerID'))
    CreatedDate = db.Column(db.Date, server_default=text('CAST(GETDATE() AS DATE)'))

    AvgRating = db.Column(db.DECIMAL(3,2))
    TotalEnrollments = db.Column(db.Integer, server_default=text('0'))

    contents = db.relationship('Content', backref='course', lazy=True)
    enrollments = db.relationship('Enrollment', backref='course', lazy=True)
    reviews = db.relationship('Review', backref='course', lazy=True)
    topics = db.relationship('CourseTopic', back_populates='course', lazy=True)