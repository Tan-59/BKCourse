# app/auth/routes.py hoặc app/auth/__init__.py
from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from .. import db
from app.models.user import User
from app.models.lecturer import Lecturer
from app.models.student import Student

bp = Blueprint("auth", __name__, url_prefix="/auth")

@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Thiếu email hoặc mật khẩu"}), 400

    user = User.query.filter_by(Email=email).first()

    # Kiểm tra user tồn tại + mật khẩu đúng (dùng Werkzeug)
    if not user or not check_password_hash(user.PasswordHash, password):
        return jsonify({"message": "Sai email hoặc mật khẩu"}), 401

    # Xác định role
    role = "lecturer" if Lecturer.query.get(user.UserID) else \
           "student" if Student.query.get(user.UserID) else "unknown"

    # Lưu session
    session["user_id"] = user.UserID
    session["role"] = role

    return jsonify({
        "message": "Đăng nhập thành công",
        "UserID": user.UserID,
        "FirstName": user.FirstName,
        "LastName": user.LastName,
        "Role": role
    }), 200