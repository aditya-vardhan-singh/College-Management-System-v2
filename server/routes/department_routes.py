from datetime import datetime
from flask import Blueprint, request, jsonify
from schema.utils import Session
from schema.college_models import Department

bp = Blueprint('departments', __name__, url_prefix='/departments')


@bp.route('/all', methods=['GET'])
def get_departments():
    '''Get all departments from database'''
    if request.method == 'GET':
        with Session() as session:
            try:
                # Get all departments
                departments = session.query(Department).limit(100).all()

                if departments:
                    # Convert department object to json list
                    departments_list = [
                        {"key": dept.department_id, "label": dept.department_name}
                        for dept in departments if dept.is_active == True
                    ]
                    return jsonify({"departments": departments_list}), 200
                else:
                    # Department list empty
                    return jsonify({"message": "No records found"}), 400
            except Exception as e:
                session.rollback()
                return jsonify({"message": "Error getting departments records", "error": str(e)}), 500


@bp.route('/list', methods=['GET'])
def get_departments_details():
    '''Get department details: id, department name, number of students, courses, and faculty in each department'''
    if request.method == 'GET':
        with Session() as session:
            try:
                departments = session.query(Department).limit(100).all()

                if departments:
                    # Convert department object to json list
                    department_list = [
                        {
                            "id": dept.department_id,
                            "department_name": dept.department_name,
                            "number_of_students": len(dept.students),
                            "number_of_courses": len(dept.courses),
                            "number_of_faculties": len(dept.faculty)
                        }
                        for dept in departments if dept.is_active
                    ]
                    return jsonify({"departments": department_list}), 200
                else:
                    return jsonify({"message", "No record found"}), 400

            except Exception as e:
                session.rollback()
                print("Error occured while fetching department records: ", str(e))
                return jsonify({"message": "Error occured while fetching department records"}), 500


@bp.route('/add', methods=['POST'])
def add_department():
    '''Add new department to database'''
    if request.method == 'POST':
        data = request.get_json()
        if 'department' not in data:
            return jsonify({"message": "Invalid parameters"}), 400

        department = data['department']

        with Session() as session:
            try:
                # Check if department already exists
                department_exists = session.query(Department).filter(Department.department_name == department['department_name']).first()
                if department_exists:
                    return jsonify({"message": "Department name already exists"}), 400

                # Add the department to database
                department_obj = Department(
                    department_name=department['department_name'],
                )
                session.add(department_obj)
                session.commit()
                return jsonify({"message": "Department added successfully"}), 200
            except Exception as e:
                session.rollback()
                return jsonify({"message": "Failed to add department"}), 500


@bp.route('/update', methods=['PUT'])
def update_department():
    '''Update existing department details'''
    if request.method == 'PUT':
        data = request.get_json()
        if 'department' not in data:
            print("Invalid parameter request")
            return jsonify({"message": "Invalid parameter request"}), 400

        department = data['department']

        with Session() as session:
            try:
                department_obj = session.query(Department).filter(Department.department_id == department['id']).first()

                if department_obj:
                    department_obj.department_name = department['department_name']
                    session.commit()
                    return jsonify({"message": "Department details updated successfully"}), 200
                else:
                    print("Department not found")
                    return jsonify({"message": "Department not found"}), 400
            except Exception as e:
                session.rollback()
                print("Failed to update department")
                return jsonify({"message": "Failed to update department"}), 500


@bp.route('/delete', methods=['DELETE'])
def delete_department():
    '''Deactivate an existing department'''
    if request.method == 'DELETE':
        if 'id' not in request.args:
            return jsonify({"message": "Invalid parameter request"}), 400
        id = request.args.get('id')
        with Session() as session:
            try:
                department_obj = session.query(Department).filter(Department.department_id == id).first()
                if department_obj:
                    department_obj.is_active = False
                    session.commit()
                    return jsonify({"message": "Department removed successfully"}), 200
                else:
                    return jsonify({"message": "Department details not found in records"}), 400
            except Exception as e:
                session.rollback()
                return jsonify({"message": "Failed to delete department"}), 500
