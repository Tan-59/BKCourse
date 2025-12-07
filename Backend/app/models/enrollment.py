from .. import db
from sqlalchemy import text

class Enrollment(db.Model):
    __tablename__ = 'Enrollments'

    CourseID = db.Column(db.String(20), db.ForeignKey('Courses.CourseID'), primary_key=True)
    StudentID = db.Column(db.String(20), db.ForeignKey('Students.StudentID'), primary_key=True)
    EnrolledAt = db.Column(db.DateTime, server_default=text('GETDATE()'))
    CompletedAt = db.Column(db.DateTime)

class Review(db.Model):
    __tablename__ = 'Reviews'

    CourseID = db.Column(db.String(20), db.ForeignKey('Courses.CourseID'), primary_key=True)
    StudentID = db.Column(db.String(20), db.ForeignKey('Students.StudentID'), primary_key=True)
    Stars = db.Column(db.Integer)  # CHECK constraint xử lý ở DB
    Content = db.Column(db.NVARCHAR(500))
    CreatedAt = db.Column(db.DateTime, server_default=text('GETDATE()'))

class Certificate(db.Model):
    __tablename__ = 'Certificates'

    LecturerID = db.Column(db.String(20), db.ForeignKey('Lecturers.LecturerID'), primary_key=True)
    CertificateName = db.Column(db.NVARCHAR(200), primary_key=True)