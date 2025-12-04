class Config:
    SECRET_KEY = 'elearning-secret-key'
    DEBUG = True

    SQLALCHEMY_DATABASE_URI = 'sqlite:///elearning.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False