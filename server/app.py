### IMPORTS ###

from flask import Flask
from flask_cors import CORS


### APP | CORS SETUP ###

app = Flask(__name__)
CORS(app)


### ROUTING ###

from routes import student_routes, department_routes, faculty_routes, attendance_routes, course_routes, enrollment_routes, class_routes, exam_routes, result_routes

app.register_blueprint(student_routes.bp)
app.register_blueprint(department_routes.bp)
app.register_blueprint(faculty_routes.bp)
app.register_blueprint(attendance_routes.bp)
app.register_blueprint(course_routes.bp)
app.register_blueprint(enrollment_routes.bp)
app.register_blueprint(class_routes.bp)
app.register_blueprint(exam_routes.bp)
app.register_blueprint(result_routes.bp)


### START SERVER ###

if __name__ == '__main__':
    app.run(debug=True)
