from flask import Blueprint, request, jsonify, session
from werkzeug.security import check_password_hash
from .. import db
from app.models.user import User
from app.models.lecturer import Lecturer
from app.models.student import Student

bp = Blueprint("auth", __name__)

@bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(Email=email).first()
    if not user or not check_password_hash(user.PasswordHash, password):
        return jsonify({"message": "Sai email hoặc mật khẩu"}), 401

    # Xác định role
    if Lecturer.query.filter_by(LecturerID=user.UserID).first():
        role = "lecturer"
    elif Student.query.filter_by(StudentID=user.UserID).first():
        role = "student"
    else:
        role = "unknown"

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
