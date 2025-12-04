from .. import db

class Lecturer(db.Model):
    __tablename__ = 'lecturers'
    LecturerID = db.Column(db.String(20), db.ForeignKey('users.UserID'), primary_key=True)
    Profession = db.Column(db.String(150), nullable=False)

    courses = db.relationship('Course', backref='lecturer', lazy=True)
    certificates = db.relationship('Certificate', backref='lecturer', lazy=True)
