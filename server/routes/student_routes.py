### Imports ###

from datetime import date
from sqlalchemy.sql.expression import and_
from flask import Blueprint, request, jsonify
from routes.utils import calculate_age
from schema.utils import Session
from schema.college_models import Enrollment, Student
from flasgger import swag_from
from flask_pydantic import validate
from pydantic import BaseModel, Field, EmailStr, field_validator, ValidationError


### Blueprint for flask app ###

bp = Blueprint('students', __name__, url_prefix='/students')


### Pydantic data models ###

class StudentModal(BaseModel):
    student_id: int
    first_name: str
    last_name: str
    age: int | None = None
    date_of_birth: date
    gender: str
    email: str
    phone: str
    address: str
    department_id: int
    department_name: str | None = None
    enrollment_date: date
    status: str

    class Config:
        from_attributes = True


class StudentCreateModal(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    gender: str = Field(..., min_length=1, max_length=15)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=15)
    date_of_birth: date
    address: str = Field(..., min_length=5, max_length=200)
    department_id: int = Field(..., gt=0)
    enrollment_date: date
    status: str = Field(..., min_length=1, max_length=10)
    courses_id: list[int] = Field(..., min_items=1)


class StudentRequestModal:
    student: StudentCreateModal


class ResponseModal(BaseModel):
    message: str
    error: str


class StudentResponseModal(BaseModel):
    message: str
    error: str
    student_list: list[StudentModal] | None


### API Routings ###

@bp.route('/all', methods=['GET'])
@validate()
@swag_from('../swagger_documentation/student_routes/get_student_list.yml')
def get_student_list():
    if request.method == 'GET':
        with Session() as session:
            try:
                students = session.query(Student).limit(100).all()

                if not students:
                    print("No records found")
                    return jsonify({
                        "message": "No records found",
                        "error": "",
                        "student_list": []
                    }), 200 # No record found

                student_list = []
                for student in students:
                    student_data = StudentModal.from_orm(student)

                    # Calculate age
                    student_data.age = calculate_age(student.date_of_birth)

                    # Populate department name
                    if student.department:
                        student_data.department_name = student.department.department_name

                    student_list.append(student_data.dict())

                return StudentResponseModal(
                    message='Success',
                    error='',
                    student_list=student_list
                ), 200 # OK

            except ValidationError as e:
                session.rollback()
                print("Invalid parameters: ", str(e))
                return StudentResponseModal(
                    message='Invalid parameters',
                    error=str(e),
                    student_list=[]
                ), 400 # Invalid request

            except Exception as e:
                session.rollback()
                print("Failed to get student list: ", str(e))
                return StudentResponseModal(
                    message="Failed to get student list",
                    error=str(e),
                    student_list=[]
                ), 500 # Internal server error


@bp.route('/v2/add', methods=['POST'])
@validate()
@swag_from('../swagger_documentation/student_routes/add_student.yml')
def add_student_v2(body: StudentRequestModal):
    if request.method == 'POST':
        student_data = body.student.dict()
        course_id = student_data.pop('course_id')

        with Session() as session:
            try:
                # Convert Pydantic model to ORM model
                student_obj = Student(**student_data)
                session.add(student_obj)
                session.flush()

                # Add enrollments
                for course_id in course_id:
                    enrollment_obj = Enrollment(
                        student_id=student_obj.student_id,
                        course_id=course_id,
                        enrollment_date=student_data['enrollment_data']
                    )
                    session.add(enrollment_obj)

                session.commit()
                return ResponseModal(
                    message="Student added successfully",
                    error=""
                ), 200 # OK

            except ValidationError as e:
                session.rollback()
                print("Invalid parameter request")
                return ResponseModal(
                    message="Invalid parameter request",
                    error=str(e)
                ), 400 # Invalid request

            except Exception as e:
                session.rollback()
                print("Failed to add student")
                return ResponseModal(
                    message="Failed to add student",
                    error=str(e)
                ), 500 # Internal server error


@bp.route('/add', methods=['POST'])
def add_student():
    if request.method == 'POST':
        data = request.get_json()
        if 'student' not in data:
            return jsonify({"message": "Invalid parameters"}), 403

        student = data['student']

        with Session() as session:
            try:
                student_obj = Student(
                    first_name=student['first_name'], last_name=student['last_name'],
                    gender=student['gender'],
                    email=student['email'],
                    phone=student['phone'], date_of_birth=student['date_of_birth'], address=student['address'], department_id=student['department_id'], enrollment_date=student['enrollment_date'], status=student['status']
                )
                session.add(student_obj)
                session.flush()
                for course_id in student['courses_id']:
                    enrollment_obj = Enrollment(
                        student_id=student_obj.student_id,
                        course_id=course_id,
                        enrollment_date=student['enrollment_date']
                    )
                    session.add(enrollment_obj)
                session.commit()
                return jsonify({"message": "Student added successfully"}), 200
            except Exception as e:
                session.rollback()
                return jsonify({"message": "Failed to add student", "error": str(e)}), 500


@bp.route('/update', methods=['PUT'])
@swag_from('../swagger_documentation/student_routes/update_student.yml')
def update_student():
    if request.method == 'PUT':
        data = request.get_json()
        if 'student' not in data:
            return jsonify({"message": "Invalid parameter request"}), 400

        student = data['student']

        with Session() as session:
            try:
                student_obj = session.query(Student).filter(Student.student_id == student['id']).first()

                if student_obj:
                    student_obj.first_name = student['first_name']
                    student_obj.last_name = student['last_name']
                    student_obj.gender = student['gender']
                    student_obj.date_of_birth = student['date_of_birth']
                    student_obj.address = student['address']
                    student_obj.email = student['email']
                    student_obj.department_id = student['department_id']
                    student_obj.enrollment_date = student['enrollment_date']
                    student_obj.phone = student['phone']
                    student_obj.status = student['status']
                    session.commit()
                    return jsonify({"message": "Student details updated successfully"}), 200
                else:
                    return jsonify({"message": "Student not found"}), 404
            except Exception as e:
                session.rollback()
                return jsonify({"message": "Failed to update student"}), 500


@bp.route('/delete', methods=['DELETE'])
@swag_from('../swagger_documentation/student_routes/delete_student.yml')
def delete_student():
    if request.method == 'DELETE':
        if 'id' not in request.args:
            return jsonify({"message": "Invalid parameters", "error": "Invalid parameter request"}), 403
        id = request.args.get('id')
        with Session() as session:
            try:
                student_obj = session.query(Student).filter(Student.student_id == id).first()
                if student_obj:
                    student_obj.status = 'left'
                    session.commit()
                    return jsonify({"message": "Student deleted successfully", "error": ""}), 200
                else:
                    return jsonify({"message": "Student not found", "error": "Student not found in records"}), 404
            except Exception as e:
                session.rollback()
                return jsonify({"message": "Failed to delete student", "error": str(e)}), 500
