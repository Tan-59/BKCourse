# test_db.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from app.config import Config

app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)

if __name__ == "__main__":
    try:
        with app.app_context():
            # Truy vấn tất cả dữ liệu từ bảng Users
            result = db.session.execute(text("SELECT * FROM Users"))
            rows = result.fetchall()
            
            if rows:
                # Lấy tên cột
                columns = result.keys()
                print("Tên cột:", columns)
                print("Dữ liệu trong bảng Users:")
                for row in rows:
                    print(dict(zip(columns, row)))
            else:
                print("Bảng Users hiện chưa có dữ liệu.")
    except Exception as e:
        print("Lỗi khi kết nối SQL Server:", e)
