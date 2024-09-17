from datetime import datetime

from sqlalchemy.sql.expression import and_

from flask import Blueprint, request, jsonify
from routes.utils import calculate_age
from schema.utils import Session
from schema.college_models import Course

bp = Blueprint('courses', __name__, url_prefix='/courses')


@bp.route('/all', methods=['GET'])
def get_courses():
    if request.method == 'GET':
        session = Session()
        try:
            courses = session.query(Course).limit(100).all()
            if courses is None:
                return jsonify({"message": "No records found"}), 400
            else:
                courses_list = [
                    {
                        "id": course.course_id,
                        "course_name": course.course_name,
                        "course_code": course.course_code,
                        "credits": course.credits,
                        "department_id": course.department_id,
                        "department": course.department.department_name,
                    }
                    for course in courses if course.is_active
                ]
                return jsonify({"users": courses_list}), 200
        except Exception as e:
            session.rollback()
            return jsonify({"message": "Error getting course records"}), 500
        finally:
            session.close()


@bp.route('/add', methods=['POST'])
def add_course():
    if request.method == 'POST':
        data = request.get_json()
        if 'course' not in data:
            print("Invalid parameters")
            return jsonify({"message": "Invalid parameters"}), 400

        course = data['course']

        with Session() as session:
            course_exists = session.query(Course).filter(and_(Course.course_name == course['course_name'], Course.department_id == course['department_id'])).first()
            if course_exists:
                print("Course with same name already exists in the department")
                return jsonify({"message": "Course with same name already exists in the department"}), 400
            course_exists = session.query(Course).filter(and_(Course.course_code == course['course_code'], Course.department_id == course['department_id'])).first()
            if course_exists:
                print("Course with same code already exists in the department")
                return jsonify({"message": "Course with same code already exists in the department"}), 400

            course_obj = Course(
                course_name=course['course_name'],
                course_code=course['course_code'],
                credits=course['credits'],
                department_id=course['department_id']
            )
            try:
                session.add(course_obj)
                session.commit()
                return jsonify({"message": "Course added successfully"}), 200
            except Exception as e:
                session.rollback()
                print("Error adding course: ", str(e))
                return jsonify({"message": "Error adding course"}), 500


@bp.route('/update', methods=['PUT'])
def update_course():
    if request.method == 'PUT':
        data = request.get_json()
        if 'course' not in data:
            print("Invalid parameter request")
            return jsonify({"message": "Invalid parameter request"}), 400

        course = data['course']

        with Session() as session:
            try:
                course_obj = session.query(Course).filter(Course.course_id == course['id']).first()

                if course_obj:
                    course_obj.course_name = student['course_name']
                    course_obj.course_code = student['course_code']
                    course_obj.credits = student['credits']
                    course_obj.department_id = student['department_id']
                    session.commit()
                    return jsonify({"message": "Course details updated successfully"}), 200
                else:
                    return jsonify({"message": "Course details not found"}), 400
            except Exception as e:
                session.rollback()
                return jsonify({"message": "Failed to update course details"}), 500


@bp.route('/delete', methods=['DELETE'])
def delete_student():
    if request.method == 'DELETE':
        if 'id' not in request.args:
            return jsonify({"message": "Invalid parameter request"}), 400
        id = request.args.get('id')
        with Session() as session:
            try:
                course_obj = session.query(Course).filter(Course.course_id == id).first()
                if course_obj:
                    course_obj.is_active = False
                    session.commit()
                    return jsonify({"message": "Course details remove successfully"}), 200
                else:
                    return jsonify({"message": "Course details not found in records"}), 400
            except Exception as e:
                session.rollback()
                return jsonify({"message": "Error occured while deleting course"}), 500
