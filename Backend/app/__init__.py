from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from app.config import Config
from sqlalchemy import inspect, text
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(Config)

    db.init_app(app)
    CORS(app)

    @app.route('/')
    def home():
        return render_template('login.html')

    # ===== Register blueprints =====
    from app.controllers.user_controller import bp as user_bp
    from app.controllers.course_controller import bp as course_bp
    from app.controllers.forum_controller import bp as forum_bp
    from app.controllers.coursetopic_controller import bp as coursetopic_bp
    from app.controllers.topic_controller import bp as topic_bp
    from app.controllers.auth_controller import bp as auth_bp
    from app.controllers.enrollment_controller import bp as enrollment_bp
    from app.controllers.review_controller import bp as review_bp
    from app.views.page_view import page_bp

    app.register_blueprint(user_bp, url_prefix='/users')
    app.register_blueprint(course_bp, url_prefix='/courses')
    app.register_blueprint(forum_bp, url_prefix='/forums')
    app.register_blueprint(coursetopic_bp, url_prefix='/coursetopic')
    app.register_blueprint(topic_bp, url_prefix='/topics')
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(enrollment_bp, url_prefix='/enrollments')
    app.register_blueprint(review_bp, url_prefix='/reviews')
    app.register_blueprint(page_bp)

    # ===== Debug: kiểm tra bảng có tồn tại trong DB =====
    with app.app_context():
        try:
            inspector = inspect(db.engine)
            tables = inspector.get_table_names(schema="dbo")

            print("===== DATABASE TABLE LIST =====")
            print(tables)

            with db.engine.connect() as conn:
                for table in tables:
                    safe_name = f"[dbo].[{table}]"
                    result = conn.execute(text(f"SELECT COUNT(*) FROM {safe_name}")).fetchone()
                    print(f"{table}: {result[0]} rows")

        except Exception as e:
            print("Lỗi kiểm tra database:", e)

    return app
