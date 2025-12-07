from .. import db
from sqlalchemy import text

class Content(db.Model):
    __tablename__ = 'Contents'

    ContentID = db.Column(db.String(20), primary_key=True,
                          server_default=text("('CNT' + RIGHT('0000' + CAST(NEXT VALUE FOR Seq_Content AS VARCHAR(10)), 4))"))
    Chapter = db.Column(db.Integer, nullable=False)
    ContentTitle = db.Column(db.NVARCHAR(255))
    ContentType = db.Column(db.String(100), nullable=False, server_default=text("'Lesson'"))
    Status = db.Column(db.String(50), nullable=False, server_default=text("'Public'"))
    CourseID = db.Column(db.String(20), db.ForeignKey('Courses.CourseID'), nullable=False)
    CreatedAt = db.Column(db.DateTime, server_default=text('GETDATE()'))

    lesson = db.relationship('Lesson', backref='content', uselist=False)
    quiz = db.relationship('Quiz', backref='content', uselist=False)

class Lesson(db.Model):
    __tablename__ = 'Lessons'
    ContentID = db.Column(db.String(20), db.ForeignKey('Contents.ContentID'), primary_key=True)
    LessonType = db.Column(db.NVARCHAR(50))  # 'Slide' hoặc 'Video'

    slides = db.relationship('LessonSlide', backref='lesson', uselist=False)
    videos = db.relationship('LessonVideo', backref='lesson', uselist=False)

class LessonSlide(db.Model):
    __tablename__ = 'LessonSlides'
    ContentID = db.Column(db.String(20), db.ForeignKey('Lessons.ContentID'), primary_key=True)
    PageCount = db.Column(db.Integer)

class LessonVideo(db.Model):
    __tablename__ = 'LessonVideos'
    ContentID = db.Column(db.String(20), db.ForeignKey('Lessons.ContentID'), primary_key=True)
    VideoLength = db.Column(db.Integer)
    TeacherID = db.Column(db.String(20))  # Có thể để LecturerID sau

class Quiz(db.Model):
    __tablename__ = 'Quiz'
    ContentID = db.Column(db.String(20), db.ForeignKey('Contents.ContentID'), primary_key=True)
    QuizContent = db.Column(db.NVARCHAR(max), nullable=False)
    TimeAllowed = db.Column(db.Integer)
    MaxScore = db.Column(db.Integer, server_default=text('10'))
    PassingScore = db.Column(db.DECIMAL(5,2), server_default=text('0'))
    StartDate = db.Column(db.DateTime)