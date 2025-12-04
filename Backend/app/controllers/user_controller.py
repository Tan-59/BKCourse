from flask import Blueprint, jsonify, request
from .. import db
from app.models.user import User
from app.models.student import Student
from app.models.lecturer import Lecturer

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
