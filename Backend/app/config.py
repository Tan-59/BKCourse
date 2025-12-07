# class Config:
#     SECRET_KEY = 'elearning-secret-key'
#     DEBUG = True

#     SQLALCHEMY_DATABASE_URI = 'sqlite:///elearning.db'
#     SQLALCHEMY_TRACK_MODIFICATIONS = False

import os

class Config:
    # Thay các thông tin dưới theo SQL Server của bạn
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-me-in-production-123456789'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    DB_USER = "sa"
    DB_PASSWORD = "HatoriHanzo"
    DB_SERVER = "192.168.1.80"
    DB_PORT = "1433"
    DB_NAME = "ELEARNING"

    # Connection string chuẩn cho SQLAlchemy + ODBC 18
    SQLALCHEMY_DATABASE_URI = (
        f"mssql+pyodbc://{DB_USER}:{DB_PASSWORD}@{DB_SERVER},{DB_PORT}/{DB_NAME}"
        "?driver=ODBC+Driver+18+for+SQL+Server"
        "&Encrypt=no"
        "&TrustServerCertificate=yes"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False