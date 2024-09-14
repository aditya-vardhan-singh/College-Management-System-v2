### IMPORTS ###

from flask import Flask
from flask_cors import CORS


### APP | CORS SETUP ###

app = Flask(__name__)
CORS(app)


### ROUTING ###

from routes import student_routes
from routes import department_routes

app.register_blueprint(student_routes.bp)
app.register_blueprint(department_routes.bp)


### START SERVER ###

if __name__ == '__main__':
    app.run(debug=True)
