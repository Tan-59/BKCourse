from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash
from .. import db
from app.models.user import User
from app.models.student import Student
from app.models.lecturer import Lecturer
from app.utils.id_generator import generate_user_id

bp = Blueprint('user', __name__, url_prefix='/users')


# ----------- GET ALL USERS -----------
@bp.route('/', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([
        {
            "UserID": u.UserID,
            "Email": u.Email,
            "FirstName": u.FirstName,
            "LastName": u.LastName
        }
        for u in users
    ])

# ----------- CREATE USER (ADMIN) -----------
@bp.route('/', methods=['POST'])
def create_user():
    data = request.json

    if not data.get("Email") or not data.get("PasswordHash"):
        return jsonify({"message": "Thiếu dữ liệu"}), 400

    user = User(
        UserID=data.get('UserID'),
        Email=data['Email'],
        PasswordHash=data['PasswordHash'],
        FirstName=data['FirstName'],
        LastName=data['LastName']
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created", "UserID": user.UserID})


# ----------- REGISTER USER -----------
@bp.route("/register", methods=["POST"])
def register_user():
    data = request.get_json() or {}

    required = ["FirstName", "LastName", "Email", "Phone", "Password", "Role"]
    if any(not data.get(field) for field in required):
        return jsonify({"message": "Thiếu dữ liệu bắt buộc"}), 400

    # Kiểm tra trùng email / phone
    if User.query.filter_by(Email=data["Email"]).first():
        return jsonify({"message": "Email đã tồn tại"}), 400
    if User.query.filter_by(Phone=data["Phone"]).first():
        return jsonify({"message": "Số điện thoại đã tồn tại"}), 400

    user_id = generate_user_id()

    # Hash mật khẩu bằng werkzeug
    hashed_password = generate_password_hash(data["Password"])

    user = User(
        UserID=user_id,
        Email=data["Email"],
        Phone=data["Phone"],
        PasswordHash=hashed_password,
        FirstName=data["FirstName"],
        LastName=data["LastName"]
    )

    db.session.add(user)

    # Gán role
    role = data["Role"].lower()
    if role == "lecturer":
        db.session.add(Lecturer(LecturerID=user_id))
    elif role == "student":
        db.session.add(Student(StudentID=user_id))

    db.session.commit()

    return jsonify({"message": "Đăng ký thành công", "UserID": user_id}), 201


# ----------- GET USER INFO -----------
@bp.route('/userinfo', methods=['GET'])
def get_user_info():
    user_id = request.args.get("userid")

    if not user_id:
        return jsonify({"error": "UserID missing"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    lecturer = Lecturer.query.get(user_id)
    student = Student.query.get(user_id)

    role = "lecturer" if lecturer else "student" if student else "unknown"

    return jsonify({
        "UserID": user.UserID,
        "FirstName": user.FirstName,
        "LastName": user.LastName,
        "Role": role
    })
