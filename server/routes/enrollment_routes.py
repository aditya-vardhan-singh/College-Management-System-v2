from datetime import datetime
from sqlalchemy import and_
from flask import Blueprint, request, jsonify
from routes.utils import department_to_json
from schema.utils import Session
from schema.college_models import Enrollment

bp = Blueprint('enrollments', __name__, url_prefix='/enrollments')


@bp.route('/student-by-course', methods=['GET'])
def get_attendances():
    '''Get all studens enrolled in a particular course'''
    if request.method == 'GET':
        if 'course_id' not in request.args:
            print("Invalid parameter request")
            return jsonify({"message": "Invalid parameter request"}), 400

        course_id = request.args.get('course_id')
        with Session() as session:
            try:
                # Get all departments
                students = session.query(Enrollment).filter(Enrollment.course_id == course_id).all()

                if students is None:
                    print("No students found")
                    return jsonify({"message": "No student record found"}), 400

                student_list = []
                for student in students:
                    print(student.student.first_name)
                    student_list.append({
                        "id": student.student_id,
                        "name": f'{student.student.first_name} {student.student.last_name}',
                        "date_of_birth": student.student.date_of_birth
                    })

                print(student_list)
                return jsonify({"student_list": student_list}), 200
            except Exception as e:
                session.rollback()
                print("Error getting student records: ", str(e))
                return jsonify({"message": "Error getting student records"}), 500
