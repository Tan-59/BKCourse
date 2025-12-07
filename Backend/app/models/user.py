from .. import db
from sqlalchemy import text

class User(db.Model):
    __tablename__ = 'Users'

    UserID = db.Column(db.String(20), primary_key=True,
                       server_default=text("('USR' + RIGHT('0000' + CAST(NEXT VALUE FOR Seq_User AS VARCHAR(10)), 4))"))
    Email = db.Column(db.String(100), unique=True, nullable=False)
    Phone = db.Column(db.String(15), unique=True)
    PasswordHash = db.Column(db.Text, nullable=False)
    FirstName = db.Column(db.NVARCHAR(100), nullable=False)
    LastName = db.Column(db.NVARCHAR(100), nullable=False)
    Gender = db.Column(db.CHAR(1))  # 'M' hoặc 'F'
    BirthDate = db.Column(db.Date)
    AvatarUrl = db.Column(db.String(500))
    CreatedAt = db.Column(db.DateTime, server_default=text('GETDATE()'))

    # Quan hệ 1-1 với Student/Lecturer
    student = db.relationship('Student', back_populates='user', uselist=False)
    lecturer = db.relationship('Lecturer', back_populates='user', uselist=False)

    posts = db.relationship('Post', backref='user', lazy=True)
    forums = db.relationship('Forum', backref='user', lazy=True)