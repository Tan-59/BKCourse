from flask import Blueprint, request, jsonify, session
from werkzeug.security import check_password_hash
from .. import db
from app.models.user import User

bp = Blueprint("auth", __name__)

@bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(Email=email).first()
    if not user or not check_password_hash(user.PasswordHash, password):
        return jsonify({"message": "Sai email hoặc mật khẩu"}), 401

    # Lưu thông tin user vào session
    session["user_id"] = user.UserID
    session["role"] = user.Role

    return jsonify({
        "message": "Đăng nhập thành công",
        "UserID": user.UserID,
        "Role": user.Role
    })
