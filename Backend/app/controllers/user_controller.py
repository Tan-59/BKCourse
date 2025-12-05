from flask import Blueprint, jsonify, request
from .. import db
from app.models.user import User
from app.models.student import Student
from app.models.lecturer import Lecturer
from werkzeug.security import generate_password_hash
from app.utils.id_generator import generate_user_id

bp = Blueprint('user', __name__)

# Lấy tất cả users
@bp.route('/', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{
        "UserID": u.UserID,
        "Email": u.Email,
        "FirstName": u.FirstName,
        "LastName": u.LastName
    } for u in users])

# Tạo user mới (POST)
@bp.route('/', methods=['POST'])
def create_user():
    data = request.json
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

@bp.route('/list', methods=['GET'])
def list_users():
    users = User.query.all()
    return jsonify([
        {
            "UserID": u.UserID,
            "FullName": f"{u.LastName} {u.FirstName}"
        }
        for u in users
    ])

@bp.route("/register", methods=["POST"])
def register_user():
    data = request.json
    first_name = data.get("FirstName")
    last_name = data.get("LastName")
    email = data.get("Email")
    phone = data.get("Phone")
    password = data.get("Password")
    role = data.get("Role")

    if not first_name or not last_name or not email or not password or not phone or not role:
        return jsonify({"message": "Thiếu dữ liệu bắt buộc"}), 400

    # check email hoặc phone đã tồn tại chưa
    if User.query.filter_by(Email=email).first():
        return jsonify({"message": "Email đã tồn tại"}), 400
    if User.query.filter_by(Phone=phone).first():
        return jsonify({"message": "Số điện thoại đã tồn tại"}), 400

    user_id = generate_user_id()

    user = User(
        UserID=user_id,
        Email=email,
        Phone=phone,
        PasswordHash=generate_password_hash(password),
        FirstName=first_name,
        LastName=last_name,
        Role=role
    )
    db.session.add(user)

    if role.lower() == "lecturer":
        lecturer = Lecturer(UserID=user_id)
        db.session.add(lecturer)

    if role.lower() == "student":
        student = Student(UserID=user_id)
        db.session.add(student)

    db.session.commit()

    return jsonify({"message": "Đăng ký thành công", "UserID": user_id})
