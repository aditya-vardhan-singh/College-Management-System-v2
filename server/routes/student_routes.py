from datetime import datetime

from sqlalchemy.sql.dml import Delete
from flask import Blueprint, request, jsonify
from routes.utils import student_to_json
from schema.utils import Session
from schema.college_models import Student

bp = Blueprint('students', __name__, url_prefix='/students')


@bp.route('/all', methods=['GET'])
def get_students():
    if request.method == 'GET':
        session = Session()
        try:
            students = session.query(Student).limit(100).all()
            students_list = [
                {
                    "id": student.student_id,
                    "first_name": student.first_name,
                    "last_name": student.last_name,
                    "age": "30",
                    "date_of_birth": student.date_of_birth,
                    "gender": student.gender,
                    "email": student.email,
                    "phone": student.phone,
                    "address": student.address,
                    "department_id": student.department_id,
                    "enrollment_date": student.enrollment_date,
                    "status": student.status
                }
                for student in students
            ]
            if students:
                return jsonify({"users": students_list}), 200
            else:
                return jsonify({"message": "No records found"}), 400
        except Exception as e:
            session.rollback()
            return jsonify({"message": "Error getting student records", "error": str(e)}), 500
        finally:
            session.close()


@bp.route('/add', methods=['POST'])
def add_student():
    if request.method == 'POST':
        data = request.get_json()
        if 'student' not in data:
            return jsonify({"message": "Invalid parameters"}), 400

        student = data['student']

        with Session() as session:
            print(student) #
            print("Ckpt 1") #
            gender = 'M' if student['gender'] == 'Male' else 'F'
            student_obj = Student(
                first_name=student['first_name'], last_name=student['last_name'],
                gender=gender,
                email=student['email'],
                phone=student['phone'], date_of_birth=student['date_of_birth'], address=student['address'], department_id=student['department_id'], enrollment_date=student['enrollment_date'], status=student['status']
            )
            print("Ckpt 2") #
            try:
                session.add(student_obj)
                session.commit()
                return jsonify({"message": "Student added successfully"}), 200
            except Exception as e:
                session.rollback()
                return jsonify({"message": "Failed to add student"}), 500


@bp.route('/update', methods=['PUT'])
def update_student():
    if request.method == 'PUT':
        data = request.get_json()
        if 'student' not in data:
            return jsonify({"message": "Invalid parameter request"}), 400

        student = data['student']

        with Session() as session:
            try:
                student_obj = session.query(Student).filter(Student.student_id == student.id).first()

                if student_obj:
                    student_obj.first_name = student.first_name
                    student_obj.last_name = student.last_name
                    student_obj.gender = student.gender
                    student_obj.date_of_birth = student.date_of_birth
                    student_obj.address = student.address
                    student_obj.email = student.email
                    student_obj.department_id = student.department_id
                    student_obj.enrollment_date = student.enrollment_date
                    student_obj.phone = student.phone
                    session.commit()
                    return jsonify({"message": "Student details updated successfully"}), 200
                else:
                    return jsonify({"message": "Student not found"}), 400
            except Exception as e:
                session.rollback()
                return jsonify({"message": "Failed to update student"}), 500


@bp.route('/delete', methods=['DELETE'])
def delete_student():
    if request.method == 'DELETE':
        if 'id' not in request.args:
            return jsonify({"message": "Invalid parameter request"}), 400
        id = request.args.get('id')
        with Session() as session:
            try:
                student_obj = session.query(Student).filter(Student.student_id == id).first()
                if student_obj:
                    student_obj.status = 'left'
                    session.commit()
                    return jsonify({"message": "Student deleted successfully"}), 200
                else:
                    return jsonify({"message": "Student not found in records"}), 400
            except Exception as e:
                session.rollback()
                return jsonify({"message": "Failed to delete student"}), 500
