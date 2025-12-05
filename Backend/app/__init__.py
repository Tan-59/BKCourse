from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from app.config import Config
from sqlalchemy import inspect, text
from flask_cors import CORS
# Khởi tạo SQLAlchemy (ORM)
db = SQLAlchemy()

def create_app():
    # Tạo app Flask, template_folder mặc định là 'app/templates'
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(Config)

    # Khởi tạo db với app
    db.init_app(app)
    CORS(app)
    # Route home
    @app.route('/')
    def home():
        return render_template('register.html')  # template nằm ngoài app, ở folder templates/

    # Import và đăng ký blueprint từ controller
    from app.controllers.user_controller import bp as user_bp
    from app.controllers.course_controller import bp as course_bp
    from app.controllers.forum_controller import bp as forum_bp
    from app.controllers.coursetopic_controller import bp as coursetopic_bp
    from app.controllers.topic_controller import bp as topic_bp

    app.register_blueprint(user_bp, url_prefix='/users')
    app.register_blueprint(course_bp, url_prefix='/courses')
    app.register_blueprint(forum_bp, url_prefix='/forums')
    app.register_blueprint(coursetopic_bp, url_prefix='/coursetopic')
    app.register_blueprint(topic_bp, url_prefix='/topics')

    print("Using database at:", db.engine.url)
    # **Tạo các bảng nếu chưa tồn tại**
    with app.app_context():
        db.create_all()  # tạo các bảng nếu chưa có

        # ===== Kiểm tra nhanh nội dung hiện tại =====
        print("===== DATABASE CONTENTS =====")
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        print("Tables:", tables)

        with db.engine.connect() as conn:
            for table in tables:
                result = conn.execute(text(f"SELECT COUNT(*) FROM {table}")).fetchone()
                print(f"{table}: {result[0]} rows")
        print("=============================")

    return app
