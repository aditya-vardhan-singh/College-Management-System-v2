from datetime import datetime
from flask import Blueprint, request, jsonify
from routes.utils import department_to_json
from schema.utils import Session
from schema.college_models import Department, Student

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
                        for dept in departments
                    ]
                    return jsonify({"departments": departments_list}), 200
                else:
                    # Department list empty
                    return jsonify({"message": "No records found"}), 400
            except Exception as e:
                session.rollback()
                return jsonify({"message": "Error getting departments records", "error": str(e)}), 500


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
    if request.method == 'PUT':
        data = request.get_json()
        if 'department' not in data:
            return jsonify({"message": "Invalid parameter request"}), 400

        department = data['department']

        with Session() as session:
            try:
                department_obj = session.query(Department).filter(Department.department_id == department.id).first()

                if department_obj:
                    department_obj.department_name = department.department_name
                    session.commit()
                    return jsonify({"message": "Department details updated successfully"}), 200
                else:
                    return jsonify({"message": "Department not found"}), 400
            except Exception as e:
                session.rollback()
                return jsonify({"message": "Failed to update department"}), 500
