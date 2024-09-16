from datetime import datetime
from flask import Blueprint, request, jsonify
from schema.utils import Session
from schema.college_models import Faculty
from routes.utils import calculate_age

bp = Blueprint('faculties', __name__, url_prefix='/faculties')


@bp.route('/all', methods=['GET'])
def get_faculty():
    '''Get all faculties from database'''
    if request.method == 'GET':
        with Session() as session:
            try:
                # Get all departments
                faculties = session.query(Faculty).limit(100).all()

                if faculties:
                    # Convert department object to json list
                    faculties_list = [
                        {
                            "id": faculty.faculty_id,
                            "first_name": faculty.first_name,
                            "last_name": faculty.last_name,
                            "age": calculate_age(faculty.date_of_birth),
                            "date_of_birth": faculty.date_of_birth,
                            "email": faculty.email,
                            "phone": faculty.phone,
                            "gender": faculty.gender,
                            "department_id": faculty.department_id,
                            "department": faculty.department.department_name,
                            "hire_date": faculty.hire_date,
                            "status": faculty.status
                        }
                        for faculty in faculties
                    ]
                    return jsonify({"faculties": faculties_list}), 200
                else:
                    # Department list empty
                    return jsonify({"message": "No records found"}), 400
            except Exception as e:
                session.rollback()
                return jsonify({"message": "Error getting faculties records", "error": str(e)}), 500


@bp.route('/add', methods=['POST'])
def add_faculty():
    '''Add new faculty to database'''
    if request.method == 'POST':
        data = request.get_json()
        if 'faculty' not in data:
            print('Invalid parameters')
            return jsonify({"message": "Invalid parameters"}), 400

        faculty = data['faculty']

        if 'first_name' not in faculty or 'last_name' not in faculty or 'email' not in faculty or 'phone' not in faculty or 'department_id' not in faculty or 'hire_date' not in faculty:
            print("Invalid parameters for faculty")
            return jsonify({"message": "Invalid parameters for faculty"}), 400

        with Session() as session:
            try:
                # Check if department already exists
                faculty_exists = session.query(Faculty).filter(Faculty.email == faculty['email']).first()
                if faculty_exists:
                    print("Faculty with same email already exists")
                    return jsonify({"message": "Faculty with same email already exists"}), 400

                # Add the department to database
                faculty_obj = Faculty(
                    first_name=faculty['first_name'],
                    last_name=faculty['last_name'],
                    email=faculty['email'],
                    gender=faculty['gender'],
                    phone=faculty['phone'],
                    department_id=faculty['department_id'],
                    hire_date=faculty['hire_date'],
                    status=faculty['status'],
                    date_of_birth=faculty['date_of_birth']
                )
                session.add(faculty_obj)
                session.commit()
                return jsonify({"message": "Faculty added successfully"}), 200
            except Exception as e:
                session.rollback()
                print("Error adding new faculty: " + str(e))
                return jsonify({"message": "Error adding new faculty"}), 500


@bp.route('/update', methods=['PUT'])
def update_faculty():
    if request.method == 'PUT':
        data = request.get_json()
        if 'faculty' not in data:
            print("Invalid parameter request")
            return jsonify({"message": "Invalid parameter request"}), 400

        faculty = data['faculty']

        if 'first_name' not in faculty or 'last_name' not in faculty or 'email' not in faculty or 'phone' not in faculty or 'department_id' not in faculty or 'hire_date' not in faculty or 'status' not in faculty:
            print("Invalid parameters for faculty")
            return jsonify({"message": "Invalid parameters for faculty"}), 400

        with Session() as session:
            try:
                faculty_obj = session.query(Faculty).filter(Faculty.faculty_id == faculty['id']).first()

                if faculty_obj:
                    faculty_obj.first_name = faculty['first_name']
                    faculty_obj.last_name = faculty['last_name']
                    faculty_obj.email = faculty['email']
                    faculty_obj.phone = faculty['phone']
                    faculty_obj.department_id = faculty['department_id']
                    faculty_obj.hire_date = faculty['hire_date']
                    faculty_obj.status = faculty['status']

                    session.commit()
                    return jsonify({"message": "Faculty details updated successfully"}), 200
                else:
                    print("Faculty not found")
                    return jsonify({"message": "Faculty not found"}), 400
            except Exception as e:
                session.rollback()
                print("Error updating faculty: ", str(e))
                return jsonify({"message": "Error updating faculty"}), 500


@bp.route('/delete', methods=['DELETE'])
def delete_faculty():
    if request.method == 'DELETE':
        if 'id' not in request.args:
            return jsonify({"message": "Invalid parameter request"}), 400
        id = request.args.get('id')
        with Session() as session:
            try:
                faculty_obj = session.query(Faculty).filter(Faculty.faculty_id == id).first()
                if faculty_obj:
                    faculty_obj.status = 'left'
                    session.commit()
                    return jsonify({"message": "Faculty deleted successfully"}), 200
                else:
                    return jsonify({"message": "Faculty not found in records"}), 400
            except Exception as e:
                session.rollback()
                return jsonify({"message": "Failed to delete faculty"}), 500
