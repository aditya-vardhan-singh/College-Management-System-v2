### IMPORTS ###

from flask import Flask
from flask_cors import CORS


### APP | CORS ###

app = Flask(__name__)
CORS(app)


### ROUTING ###

from routes import student_routes, teacher_routes, subject_routes

app.register_blueprint(student_routes.bp)
app.register_blueprint(teacher_routes.bp)
app.register_blueprint(subject_routes.bp)


### START SERVER ###

if __name__ == '__main__':
    app.run(debug=True)
