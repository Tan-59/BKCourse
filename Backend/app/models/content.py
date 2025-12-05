from .. import db
from app.utils.id_generator import generate_content_id

class Content(db.Model):
    __tablename__ = 'contents'
    ContentID = db.Column(db.String(20), primary_key=True, default=generate_content_id)
    Chapter = db.Column(db.Integer, nullable=False)
    ContentTitle = db.Column(db.String(255))
    ContentType = db.Column(db.String(100), nullable=False, default='Lesson')
    Status = db.Column(db.String(50), nullable=False, default='Public')
    CourseID = db.Column(db.String(20), db.ForeignKey('courses.CourseID'))
    CreatedAt = db.Column(db.DateTime)

    # Mối quan hệ với Lessons / Quiz
    lesson = db.relationship('Lesson', backref='content', uselist=False)
    quiz = db.relationship('Quiz', backref='content', uselist=False)

class Lesson(db.Model):
    __tablename__ = 'lessons'
    ContentID = db.Column(db.String(20), db.ForeignKey('contents.ContentID'), primary_key=True)
    LessonType = db.Column(db.String(50))

    slides = db.relationship('LessonSlide', backref='lesson', lazy=True)
    videos = db.relationship('LessonVideo', backref='lesson', lazy=True)

class LessonSlide(db.Model):
    __tablename__ = 'lesson_slides'
    ContentID = db.Column(db.String(20), db.ForeignKey('lessons.ContentID'), primary_key=True)
    PageCount = db.Column(db.Integer)

class LessonVideo(db.Model):
    __tablename__ = 'lesson_videos'
    ContentID = db.Column(db.String(20), db.ForeignKey('lessons.ContentID'), primary_key=True)
    VideoLength = db.Column(db.Integer)
    TeacherID = db.Column(db.String(20))

class Quiz(db.Model):
    __tablename__ = 'quiz'
    ContentID = db.Column(db.String(20), db.ForeignKey('contents.ContentID'), primary_key=True)
    QuizContent = db.Column(db.Text, nullable=False)
    TimeAllowed = db.Column(db.Integer)
    MaxScore = db.Column(db.Integer, default=10)
    PassingScore = db.Column(db.Float, default=0)
    StartDate = db.Column(db.DateTime)
