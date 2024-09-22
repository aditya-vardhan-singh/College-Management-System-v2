from datetime import datetime

from sqlalchemy.sql.expression import and_

from flask import Blueprint, request, jsonify
from routes.utils import calculate_age
from schema.utils import Session
from schema.college_models import Classroom

bp = Blueprint('classes', __name__, url_prefix='/classes')


@bp.route('/all', methods=['GET'])
def get_classroom():
    if request.method == 'GET':
        with Session() as session:
            try:
                classrooms = session.query(Classroom).limit(100).all()
                if classrooms is None:
                    return jsonify({"message": "No records found"}), 400
                else:
                    classroom_list = [
                        {
                            "id": classroom.classroom_id,
                            "room_number": classroom.room_number,
                            "course_id": classroom.course_id,
                            "course": classroom.course.course_name,
                            "faculty_id": classroom.faculty_id,
                            "faculty": f'{classroom.faculty.first_name} {classroom.faculty.last_name}',
                            "schedule_time": str(classroom.schedule_time),
                        }
                        for classroom in classrooms if classroom.is_active
                    ]
                    return jsonify({"classrooms": classroom_list}), 200
            except Exception as e:
                session.rollback()
                print("Error getting classroom records: ", str(e))
                return jsonify({"message": "Error getting classroom records"}), 500


@bp.route('/add', methods=['POST'])
def add_classroom():
    if request.method == 'POST':
        data = request.get_json()
        if 'classroom' not in data:
            return jsonify({"message": "Invalid parameters"}), 400

        classroom = data['classroom']

        with Session() as session:
            try:
                classroom_obj = Classroom(
                    room_number = classroom['room_number'],
                    course_id = classroom['course_id'],
                    faculty_id = classroom['faculty_id'],
                    schedule_time = classroom['schedule_time']
                )
                session.add(classroom_obj)
                session.commit()
                return jsonify({"message": "Course added successfully"}), 200
            except Exception as e:
                session.rollback()
                return jsonify({"message": "Failed to add course"}), 500


@bp.route('/update', methods=['PUT'])
def update_classroom():
    if request.method == 'PUT':
        data = request.get_json()
        if 'classroom' not in data:
            return jsonify({"message": "Invalid parameter request"}), 400

        classroom = data['classroom']

        with Session() as session:
            try:
                classroom_obj = session.query(Classroom).filter(Classroom.classroom_id == classroom['id']).first()

                if classroom_obj:
                    classroom_obj.room_number = classroom['room_number']
                    classroom_obj.course_id = classroom['course_id']
                    classroom_obj.faculty_id = classroom['faculty_id']
                    classroom_obj.schedule_time = classroom['schedule_time']
                    session.commit()
                    return jsonify({"message": "Classroom details updated successfully"}), 200
                else:
                    return jsonify({"message": "Classroom not found"}), 400
            except Exception as e:
                session.rollback()
                return jsonify({"message": "Failed to update Classroom"}), 500


@bp.route('/delete', methods=['DELETE'])
def delete_classroom():
    if request.method == 'DELETE':
        if 'id' not in request.args:
            return jsonify({"message": "Invalid parameter request"}), 400
        id = request.args.get('id')
        with Session() as session:
            try:
                classroom_obj = session.query(Classroom).filter(Classroom.classroom_id == id).first()
                if classroom_obj:
                    classroom_obj.is_active = False
                    session.commit()
                    return jsonify({"message": "Classroom removed successfully"}), 200
                else:
                    return jsonify({"message": "Classroom not found in records"}), 400
            except Exception as e:
                session.rollback()
                return jsonify({"message": "Failed to remove classroom"}), 500
