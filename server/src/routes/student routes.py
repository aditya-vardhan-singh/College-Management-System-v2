from flask import Blueprint, request, jsonify
from sqlalchemy import between

from utils import Session
from schema.college_models import Student, Faculty, Subject, Attendance, Marks

bp = Blueprint('students', __name__, url_prefix='/students')


@bp.route('/get', methods=['GET'])
def get_students():
    '''
    DESC: Fetch all students from Student Table \n
    ARGS: limit:int \n
    RETURNS: json(students: list(dict(str:str), message: str) \n
    '''

    # Check arguments
    limit = request.args.get('limit', default=100, type=int)

    try:
        # Query all students with a limit
        session = Session()
        students = session.query(Student).order_by(Student.roll_no).limit(limit).all()

        # Extract records from query result
        students_list = []
        if students:
            students_list = [
                {
                    'rollNumber': student.roll_no,
                    'name': student.name,
                    'age': student.age,
                    'gender': student.gender,
                    'fatherName': student.father_name,
                    'classTeacher': student.class_teacher.name
                }
                for student in students
            ]

        return jsonify({ 'message': 'Records found successfully', 'students': students_list }), 200

    except Exception as e:
        session.rollback()
        return jsonify({ 'message': 'Error fetching records', 'students': '' }), 500

    finally:
        session.close()


@bp.route('/register', methods=['POST'])
def register_student():
    '''
    DESC: Register a new student\n
    RETURNS: json(message: str)\n
    '''

    # Check arguments
    data = request.get_json()

    # Name
    first_name = data.get('fName').strip()
    middle_name = data.get('mName').strip()
    last_name = data.get('lName').strip()

    name = first_name + (' ' if middle_name else '') + middle_name + ' ' + last_name

    # Age, Gender
    age = data.get('age')
    gender = data.get('gender')

    gender = 'M' if gender == 'Male' else 'F'

    # Father's Name, Class Teacher's Name
    father_name = data.get('fatherName').strip()
    class_teacher = data.get('classTeacher')
    subjects = data.get('subjects')

    try:
        session = Session()

        # Find class teacher in Teachers Table
        class_teacher_id = session.query(Teacher.id).filter(Teacher.name.ilike('%' + class_teacher + '%')).first()
        class_teacher_id = class_teacher_id[0]

        if class_teacher_id is None:
            return jsonify({ 'message': 'Class teacher not found' }), 404

        # Create a new Student object
        student = Student(name=name, age=age, gender=gender, father_name=father_name, class_teacher_id=class_teacher_id)

        # Add student's subjects
        for subject in subjects:
            # Find subject in Subjects Table
            subject_obj = session.query(Subject).filter(Subject.name == subject).first()

            if subject_obj is None:
                return jsonify({ 'message': 'Subject not found' }), 404

            # Add subject to student's subjects list
            student.subjects.append(subject_obj)

        session.add(student)
        session.commit()

        return jsonify({ 'message': 'Student added successfully' }), 200

    except Exception as e:
        session.rollback()
        return jsonify({ 'message': 'Error adding student' }), 500

    finally:
        session.close()


@bp.route('/delete', methods=['DELETE'])
def delete_student():
    '''
    DESC: Delete a student\n
    '''

    # Check arguments
    data = request.get_json()
    roll_no = data.get('rollNo')

    try:
        session = Session()

        # Find student in Students Table
        student = session.query(Student).filter(Student.roll_no == roll_no).one_or_none()

        if student is None:
            return jsonify({ 'message': 'Student not found' }), 404

        session.delete(student)
        session.commit()

        return jsonify({ 'message': 'Student deleted successfully' }), 200

    except Exception as e:
        session.rollback()
        return jsonify({ 'message': 'Error deleting student' }), 500

    finally:
        session.close()


@bp.route('update', methods=['PUT'])
def update_student():
    pass


@bp.route('/find', methods=['GET'])
def find_student():
    '''
    DESC: Find student by roll number
    '''

    # Check arguments
    roll_no = request.args.get('rollNo')

    try:
        session = Session()

        # Find student in Students Table
        student = session.query(Student).filter(Student.roll_no == roll_no).one_or_none()

        if student is None:
            return jsonify(
                {
                    'message': 'Student not found',
                    'student': ''
                }), 404

        return jsonify(
            {
                'message': 'Student found successfully',
                'student':
                    {
                        'rollNumber': student.roll_no,
                        'name': student.name,
                        'age': student.age,
                        'gender': student.gender,
                        'fatherName': student.father_name,
                        'classTeacher': student.class_teacher.name
                    }
            }), 200

    except Exception as e:
        session.rollback()
        return jsonify({ 'message': 'Error fetching student', 'student': '' }), 500

    finally:
        session.close()


@bp.route('/update', methods=['POST'])
def update_student_details():
    '''
    DESC: Update student details
    '''

    # Check arguments
    data = request.get_json()

    if 'rollNo' not in data or 'student' not in data or 'subjects' not in data:
        return jsonify({ 'message': 'Incomplete data' }), 400

    roll_no = data.get('rollNo')
    student = data.get('student')
    subjects = data.get('subjects')

    print(subjects)

    name = student.get('name').strip()
    age = student.get('age')
    gender = 'M' if student.get('gender') == 'Male' else 'F'
    father_name = student.get('fatherName').strip()
    class_teacher = student.get('classTeacher')

    try:
        session = Session()

        # Find student in Students Table
        student = session.query(Student).filter(Student.roll_no == roll_no).one_or_none()

        if student is None:
            return jsonify({ 'message': 'Student not found' }), 404

        student.name = name
        student.age = age
        student.gender = gender
        student.father_name = father_name

        class_teacher = session.query(Teacher.id).filter(Teacher.name.ilike('%' + class_teacher + '%')).scalar()
        if class_teacher:
            student.class_teacher_id = class_teacher

        student_subjects = []
        for subject in subjects:
            try:
                subject_obj = session.query(Subject).filter(Subject.name == subject).one_or_none()
                if subject_obj:
                    student_subjects.append(subject_obj)
            except Exception as e:
                return jsonify({ 'message': 'Error querying subjects' }), 500

        student.subjects = student_subjects

        session.commit()

        return jsonify({ 'message': 'Student details updated successfully' }), 200

    except Exception as e:
        session.rollback()
        return jsonify({ 'message': 'Error updating student details' }), 500

    finally:
        session.close()


@bp.route('/subjects', methods=['GET'])
def get_student_subjects():
    '''
    DESC: Get a list of subjects for a student
    '''

    # Check arguments
    roll_no = request.args.get('rollNo')

    try:
        session = Session()

        # Find student in Students Table
        student = session.query(Student).filter(Student.roll_no == roll_no).one_or_none()

        if student is None:
            return jsonify({ 'message': 'Student not found','subjects': '' }), 404

        subjects = [
            {
                'id': subject.id,
                'name': subject.name
            }
            for subject in student.subjects
        ]

        return jsonify({ 'message': 'Subjects found successfully','subjects': subjects }), 200

    except Exception as e:
        session.rollback()
        return jsonify({ 'message': 'Error fetching subjects', 'subjects': '' }), 500

    finally:
        session.close()


@bp.route('/attendance', methods=['GET', 'POST'])
def student_attendance():
    '''
    GET:\n
    DESC: Get list of students who are present between a start date and an end date.\n
    '''

    if request.method == 'GET':

        # Check arguments
        date_from = request.args.get('dateFrom')
        date_to = request.args.get('dateTo')

        try:
            session = Session()

            # Fetch attendance between the given dates
            attendance_list = session.query(Attendance).filter(between(Attendance.date, date_from, date_to)).all()

            attendance_list_json = []
            for attendance in attendance_list:
                student = session.query(Student).filter(Student.roll_no == attendance.student_roll_no).one_or_none()
                if student:
                    attendance_list_json.append({
                        'key': f"{student.roll_no}{attendance.date.strftime('%Y-%m-%d')}",
                        'rollNo': student.roll_no,
                        'name': student.name,
                        'date': attendance.date.strftime('%Y-%m-%d'),
                       'status': 'Present' if attendance.mark else 'Absent'
                    })

            return jsonify({ 'message': 'Attendance found successfully', 'attendance': attendance_list_json }), 200

        except Exception as e:
            session.rollback()
            return jsonify({'message': 'Error occurred while fetching attendance list'}), 500

        finally:
            session.close()

    if request.method == 'POST':

        # Check arguments

        data = request.get_json()

        if 'date' not in data or 'rollNumbers' not in data:
            return jsonify({'message': 'Invalid request data'}), 400

        try:
            session = Session()

            for id in data['rollNumbers']:
                session.add(Attendance(date=data['date'], student_roll_no=id, mark=True))

            session.commit()

            return jsonify({'message': 'Attendance marked successfully'}), 200

        except Exception as e:
            session.rollback()
            return jsonify({'message': 'Error occurred while marking attendance'}), 500

        finally:
            session.close()


# @bp.route('/marks', methods=['POST'])
# def mark_student_marks():
#     '''
#     DESC: Mark marks for a student
#     '''

#     # Check arguments
#     data = request.get_json()

#     if 'rollNo' not in data or not isinstance(data['subjects'], list):
#         return jsonify({'message': 'Invalid request data'}), 400

#     try:
#         session = Session()

#         # Check if student exists
#         student = session.query(Student).filter_by(roll_no=data['rollNo']).one_or_none()

#         if not student:
#             return jsonify({'message': 'Student not found'}), 404

#         marks = [
#             Marks(marks=subject.marks, subject_id=subject['id'], student_roll_no=data['rollNo']) for subject in data['subjects']
#         ]

#         session.add_all(marks)
#         session.commit()

#         return jsonify({'message': 'Marks marked successfully'}), 200

#     except Exception as e:
#         session.rollback()
#         return jsonify({'message': 'Error occurred while marking marks'}), 500

#     finally:
#         session.close()


@bp.route('/marks', methods=['POST'])
def mark_student_marks():
    '''
    DESC: Mark marks for a student
    '''

    # Check arguments
    data = request.get_json()

    if 'rollNo' not in data or not isinstance(data['subjects'], list):
        return jsonify({'message': 'Invalid request data'}), 400

    try:
        session = Session()

        # Check if student exists
        student = session.query(Student).filter_by(roll_no=data['rollNo']).one_or_none()

        if not student:
            return jsonify({'message': 'Student not found'}), 404

        marks = [
            Marks(marks=subject.marks, subject_id=subject.id, student_roll_no=data['rollNo']) for subject in data['subjects']
        ]

        session.add_all(marks)
        session.commit()

        return jsonify({'message': 'Marks marked successfully'}), 200

    except Exception as e:
        session.rollback()
        return jsonify({'message': 'Error occurred while marking marks'}), 500

    finally:
        session.close()
