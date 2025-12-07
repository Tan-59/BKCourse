from flask import Blueprint, render_template

page_bp = Blueprint("page", __name__)

# =========================
# Lecturer Pages
# =========================
@page_bp.route("/homeLecturer")
def home_lecturer():
    return render_template("homeLecturer.html")

# =========================
# Student Pages
# =========================
@page_bp.route("/homeStudent")
def home_student():
    return render_template("homeStudent.html")

# =========================
# Login Page
# =========================
@page_bp.route("/login")
def login_page():
    return render_template("login.html")

# =========================
# Course Student Page
# =========================
@page_bp.route("/courseStudent")
def course_student():
    return render_template("CourseStudent.html")

# =========================
# Course Lecturer Page
# =========================
@page_bp.route("/courseLecturer")
def course_lecturer():
    return render_template("CourseLecturer.html")

# =========================
# Forum Page
# =========================
@page_bp.route("/forum")
def forum_page():
    return render_template("Forum.html")

# =========================
# Register Page
# =========================
@page_bp.route("/register")
def register_page():
    return render_template("register.html")