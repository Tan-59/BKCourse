from functools import wraps
from flask import session, jsonify

def lecturer_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if "user_id" not in session or session.get("role") != "Lecturer":
            return jsonify({"message": "Chỉ dành cho giảng viên"}), 403
        return f(*args, **kwargs, lecturer_id=session["user_id"])
    return decorated
