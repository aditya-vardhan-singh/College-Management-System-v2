
# @bp.route('/v1/all', methods=['GET'])
# def get_students():
#     if request.method == 'GET':
#         session = Session()
#         try:
#             students = session.query(Student).limit(100).all()
#             if students is None:
#                 return jsonify({"message": "No records found"}), 400
#             else:
#                 students_list = [
#                     {
#                         "id": student.student_id,
#                         "first_name": student.first_name,
#                         "last_name": student.last_name,
#                         "age": calculate_age(str(student.date_of_birth)),
#                         "date_of_birth": student.date_of_birth,
#                         "gender": student.gender,
#                         "email": student.email,
#                         "phone": student.phone,
#                         "address": student.address,
#                         "department_id": student.department_id,
#                         "department": student.department.department_name,
#                         "enrollment_date": student.enrollment_date,
#                         "status": student.status
#                     }
#                     for student in students
#                 ]
#                 return jsonify({"users": students_list}), 200
#         except Exception as e:
#             session.rollback()
#             return jsonify({"message": "Error getting student records", "error": str(e)}), 500
#         finally:
#             session.close()
