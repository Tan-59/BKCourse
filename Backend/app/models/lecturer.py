from .. import db

class Lecturer(db.Model):
    __tablename__ = 'Lecturers'

    LecturerID = db.Column(db.String(20), db.ForeignKey('Users.UserID'), primary_key=True)
    Profession = db.Column(db.NVARCHAR(150), nullable=True)  # Đã bỏ NOT NULL

    user = db.relationship('User', back_populates='lecturer')
    courses = db.relationship('Course', backref='lecturer', lazy=True)
    certificates = db.relationship('Certificate', backref='lecturer', lazy=True)