import datetime
from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey, CheckConstraint, Time
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.sql.sqltypes import Boolean
from schema.utils import Base, Session, engine


# 1. Students Table
class Student(Base):
    __tablename__ = 'students'

    student_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    gender: Mapped[str] = mapped_column(String(15), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(15), nullable=True)
    date_of_birth: Mapped[str] = mapped_column(String(15), nullable=False)
    address: Mapped[Text] = mapped_column(Text, nullable=True)
    department_id: Mapped[int] = mapped_column(ForeignKey('departments.department_id'))
    enrollment_date: Mapped[str] = mapped_column(String(15), nullable=False)
    status: Mapped[str] = mapped_column(String(10), nullable=False)
    # deleted: Mapped[bool] = mapped_column(Boolean, nullable=False)

    department: Mapped['Department'] = relationship(back_populates='students')
    enrollments: Mapped[list['Enrollment']] = relationship(back_populates='student')
    attendances: Mapped[list['Attendance']] = relationship(back_populates='student')
    results: Mapped[list['Result']] = relationship(back_populates='student')


# 2. Courses Table
class Course(Base):
    __tablename__ = 'courses'

    course_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    course_name: Mapped[str] = mapped_column(String(100), nullable=False)
    course_code: Mapped[str] = mapped_column(String(10), unique=True, nullable=False)
    credits: Mapped[int] = mapped_column(Integer, nullable=False)
    department_id: Mapped[int] = mapped_column(ForeignKey('departments.department_id'))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    department: Mapped['Department'] = relationship(back_populates='courses')
    enrollments: Mapped[list['Enrollment']] = relationship(back_populates='course')
    attendances: Mapped[list['Attendance']] = relationship(back_populates='course')
    classrooms: Mapped[list['Classroom']] = relationship(back_populates='course')
    exams: Mapped[list['Exam']] = relationship(back_populates='course')
    results: Mapped[list['Result']] = relationship(back_populates='course')


# 3. Departments Table
class Department(Base):
    __tablename__ = 'departments'

    department_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    department_name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    # head_of_department: Mapped[int] = mapped_column(ForeignKey('faculty.faculty_id'))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    students: Mapped[list['Student']] = relationship(back_populates='department')
    courses: Mapped[list['Course']] = relationship(back_populates='department')
    faculty: Mapped[list['Faculty']] = relationship(back_populates='department')


# 4. Faculty Table
class Faculty(Base):
    __tablename__ = 'faculty'

    faculty_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    gender: Mapped[str] = mapped_column(String(15), nullable=False)
    phone: Mapped[str] = mapped_column(String(15), nullable=True)
    department_id: Mapped[int] = mapped_column(ForeignKey('departments.department_id'))
    hire_date: Mapped[str] = mapped_column(String(15), nullable=False)
    status: Mapped[str] = mapped_column(String(15), nullable=False)
    date_of_birth: Mapped[str] = mapped_column(String(15), nullable=False)

    department: Mapped['Department'] = relationship(back_populates='faculty')
    classrooms: Mapped[list['Classroom']] = relationship(back_populates='faculty')


# 5. Enrollment Table
class Enrollment(Base):
    __tablename__ = 'enrollment'

    enrollment_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(ForeignKey('students.student_id'))
    course_id: Mapped[int] = mapped_column(ForeignKey('courses.course_id'))
    enrollment_date: Mapped[str] = mapped_column(String(15), nullable=False)
    grade: Mapped[str] = mapped_column(String(2), nullable=True)

    student: Mapped['Student'] = relationship(back_populates='enrollments')
    course: Mapped['Course'] = relationship(back_populates='enrollments')


# 6. Attendance Table
class Attendance(Base):
    __tablename__ = 'attendance'

    attendance_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(ForeignKey('students.student_id'))
    course_id: Mapped[int] = mapped_column(ForeignKey('courses.course_id'))
    attendance_date: Mapped[str] = mapped_column(String(15), nullable=False)
    status: Mapped[str] = mapped_column(String(10), CheckConstraint("status IN ('Present', 'Absent')"), nullable=False)

    student: Mapped['Student'] = relationship(back_populates='attendances')
    course: Mapped['Course'] = relationship(back_populates='attendances')


# 7. Classroom Table
class Classroom(Base):
    __tablename__ = 'classrooms'

    classroom_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    room_number: Mapped[str] = mapped_column(String(10), nullable=False)
    course_id: Mapped[int] = mapped_column(ForeignKey('courses.course_id'))
    faculty_id: Mapped[int] = mapped_column(ForeignKey('faculty.faculty_id'))
    schedule_time: Mapped[Time] = mapped_column(Time, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    course: Mapped['Course'] = relationship(back_populates='classrooms')
    faculty: Mapped['Faculty'] = relationship(back_populates='classrooms')


# 8. Exams Table
class Exam(Base):
    __tablename__ = 'exams'

    exam_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    course_id: Mapped[int] = mapped_column(ForeignKey('courses.course_id'))
    exam_date: Mapped[str] = mapped_column(String(15), nullable=False)
    exam_type: Mapped[str] = mapped_column(String(50), nullable=False)  # 'Midterm', 'Final', etc.
    max_marks: Mapped[int] = mapped_column(Integer, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    course: Mapped['Course'] = relationship(back_populates='exams')
    results: Mapped[list['Result']] = relationship(back_populates='exam')


# 9. Results Table
class Result(Base):
    __tablename__ = 'results'

    result_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(ForeignKey('students.student_id'))
    exam_id: Mapped[int] = mapped_column(ForeignKey('exams.exam_id'))
    course_id: Mapped[int] = mapped_column(ForeignKey('courses.course_id'))
    marks_obtained: Mapped[int] = mapped_column(Integer, nullable=False)

    student: Mapped['Student'] = relationship(back_populates='results')
    exam: Mapped['Exam'] = relationship(back_populates='results')
    course: Mapped['Course'] = relationship(back_populates='results')


Base.metadata.create_all(engine)

# with Session() as db:
#     faculty = Faculty(
#         first_name='Mohan',
#         last_name='Roy',
#         email='mohan.roy@example.com',
#         phone='6293855192',
#         department_id=1,
#         hire_date=datetime.datetime.strptime('2024/08/01','%Y/%m/%d')
#     )
#     department = Department(
#         department_name='Computer Science & Engineering',
#         # head_of_department=1
#     )
#     student = Student(
#         first_name='Tony',
#         last_name='Reichert',
#         gender='M',
#         email='tony.reichert@example.com',
#         phone='8528736532',
#         date_of_birth= datetime.datetime.strptime('2002/11/09', '%Y/%m/%d'),
#         address='Springfield, MO, United States', department_id=2,
#         enrollment_date=datetime.datetime.strptime('2024/09/01', '%Y/%m/%d'),
#         deleted=False
#     )

#     try:
#         db.add_all([faculty, department, student])
#     except Exception as e:
#         db.rollback()
#         print("An error occured")


##### SESSION OPERATIONS #####

# from flask import jsonify

# session = Session()

# department = session.query(Department.department_id, Department.department_name).limit(100).all()
