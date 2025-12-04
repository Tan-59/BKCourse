from .. import db

class Enrollment(db.Model):
    __tablename__ = 'enrollments'
    CourseID = db.Column(db.String(20), db.ForeignKey('courses.CourseID'), primary_key=True)
    StudentID = db.Column(db.String(20), db.ForeignKey('students.StudentID'), primary_key=True)
    EnrolledAt = db.Column(db.DateTime)
    CompletedAt = db.Column(db.DateTime)

class Review(db.Model):
    __tablename__ = 'reviews'
    CourseID = db.Column(db.String(20), db.ForeignKey('courses.CourseID'), primary_key=True)
    StudentID = db.Column(db.String(20), db.ForeignKey('students.StudentID'), primary_key=True)
    Stars = db.Column(db.Integer)
    Content = db.Column(db.String(500))
    CreatedAt = db.Column(db.DateTime)

class Certificate(db.Model):
    __tablename__ = 'certificates'
    LecturerID = db.Column(db.String(20), db.ForeignKey('lecturers.LecturerID'), primary_key=True)
    CertificateName = db.Column(db.String(200), primary_key=True)
