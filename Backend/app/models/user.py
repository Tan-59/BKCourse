from .. import db
from app.utils.id_generator import generate_user_id

class User(db.Model):
    __tablename__ = 'users'

    UserID = db.Column(db.String(20), primary_key=True, default=generate_user_id)
    Email = db.Column(db.String(100), unique=True, nullable=False)
    Phone = db.Column(db.String(15), unique=True)
    PasswordHash = db.Column(db.String(255), nullable=False)
    FirstName = db.Column(db.String(100), nullable=False)
    LastName = db.Column(db.String(100), nullable=False)
    Gender = db.Column(db.String(1))
    BirthDate = db.Column(db.Date)
    AvatarUrl = db.Column(db.String(500))
    CreatedAt = db.Column(db.DateTime)

    # Quan hệ với các bảng khác
    student = db.relationship('Student', backref='user', uselist=False)
    lecturer = db.relationship('Lecturer', backref='user', uselist=False)
    posts = db.relationship('Post', backref='user', lazy=True)
    forums = db.relationship('Forum', backref='user', lazy=True)
