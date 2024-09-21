from datetime import datetime
from sqlalchemy import and_
from flask import Blueprint, request, jsonify
from routes.utils import department_to_json
from schema.utils import Session
from schema.college_models import Attendance, Enrollment

bp = Blueprint('attendances', __name__, url_prefix='/attendances')


@bp.route('/all', methods=['GET'])
def get_attendances():
    '''Get all attendance records from database'''
    if request.method == 'GET':
        with Session() as session:
            try:
                # Get all departments
                attendances = session.query(Attendance).limit(100).all()

                if attendances:
                    # Convert department object to json list
                    attendances_list = [
                        {
                            "id": attendance.attendance_id,
                            "student_id": attendance.student.student_id,
                            "first_name": attendance.student.first_name,
                            "last_name": attendance.student.last_name,
                            "department": attendance.student.department.department_name,
                            "department_id": attendance.student.department_id,
                            "course": attendance.course.course_name,
                            "course_id": attendance.course_id,
                            "attendance_date": attendance.attendance_date,
                            "status": attendance.status
                        }
                        for attendance in attendances
                    ]
                    return jsonify({"attendances": attendances_list}), 200
                else:
                    # Department list empty
                    print("No records found")
                    return jsonify({"message": "No records found"}), 400
            except Exception as e:
                session.rollback()
                print("Error getting attendance records: ", str(e))
                return jsonify({"message": "Error getting attendance records"}), 500


@bp.route('/add', methods=['POST'])
def add_attendance():
    '''Add new attendance to database'''
    if request.method == 'POST':
        data = request.get_json()
        if 'attendance' not in data:
            print("Invalid params")
            return jsonify({"message": "Invalid parameters"}), 400

        attendance = data['attendance']

        if 'attendance_date' not in attendance or 'student_ids' not in attendance or 'course_id' not in attendance:
            print("Invalid attendance params")
            return jsonify({"message": "Invalid attendance parameters"}), 400

        attendance_date = attendance['attendance_date']
        students_list = attendance['student_ids']
        course_id = attendance['course_id']

        with Session() as session:
            try:
                # If all students are selected, update students_list
                if students_list == ['a','l','l']:
                    students_list = []
                    enrollment_obj = session.query(Enrollment).all()
                    for enrollment in enrollment_obj:
                        students_list.append(enrollment.student_id)

                for student in students_list:
                    is_duplicate = session.query(Attendance).filter(and_(
                        Attendance.student_id == student,
                        Attendance.attendance_date == attendance_date,
                        Attendance.course_id == course_id
                    )).first()

                    if is_duplicate is None:
                        print("True for ", student)
                        attd = Attendance(
                            student_id=student,
                            course_id=course_id,
                            attendance_date=attendance_date,
                            status='Present'
                        )
                        session.add(attd)

                session.commit()
                return jsonify({"message": "Attendance marked successfully"}), 200
            except Exception as e:
                session.rollback()
                print("Error occured while marking attendance:", str(e))
                return jsonify({"message": "An error occured while marking attendance"}), 500


@bp.route('/delete', methods=['DELETE'])
def delete_attendance():
    '''Delete an attendance record'''
    if request.method == 'DELETE':
        if 'id' not in request.args:
            return jsonify({"message": "Invalid parameter request"}), 400
        id = request.args.get('id')
        with Session() as session:
            try:
                attendance_obj = session.query(Attendance).filter(Attendance.attendance_id == id).first()
                if attendance_obj:
                    session.delete(attendance_obj)
                    session.commit()
                    return jsonify({"message": "Attendance removed successfully"}), 200
                else:
                    return jsonify({"message": "Attendance not found in records"}), 400
            except Exception as e:
                session.rollback()
                return jsonify({"message": "Failed to delete attendance"}), 500


# @bp.route('/update', methods=['PUT'])
# def update_attendance():
#     if request.method == 'PUT':
#         data = request.get_json()
#         if 'attendance' not in data:
#             return jsonify({"message": "Invalid parameter request"}), 400

#         department = data['department']

#         with Session() as session:
#             try:
#                 department_obj = session.query(Department).filter(Department.department_id == department.id).first()

#                 if department_obj:
#                     department_obj.department_name = department.department_name
#                     session.commit()
#                     return jsonify({"message": "Department details updated successfully"}), 200
#                 else:
#                     return jsonify({"message": "Department not found"}), 400
#             except Exception as e:
#                 session.rollback()
#                 return jsonify({"message": "Failed to update department"}), 500
