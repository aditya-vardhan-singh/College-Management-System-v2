from sqlalchemy.sql import and_
from flask import Blueprint, request, jsonify
from schema.utils import Session
from schema.college_models import Exam

bp = Blueprint('exams', __name__, url_prefix='/exams')


@bp.route('/all', methods=['GET'])
def get_exams():
    if request.method == 'GET':
        session = Session()
        try:
            exams = session.query(Exam).limit(100).all()
            if exams is None:
                print("No record found")
                return jsonify({"exams": []}), 200
            else:
                exams_list = [
                    {
                        "id": exam.exam_id,
                        "course_id": exam.course_id,
                        "course": exam.course.course_name,
                        "exam_date": exam.exam_date,
                        "exam_type": exam.exam_type,
                        "max_marks": exam.max_marks
                    }
                    for exam in exams if exam.is_active
                ]
                return jsonify({"exams": exams_list}), 200
        except Exception as e:
            session.rollback()
            print("Error getting exam records: ", str(e))
            return jsonify({"message": "Error getting exam records"}), 500
        finally:
            session.close()


@bp.route('/add', methods=['POST'])
def add_exams():
    if request.method == 'POST':
        data = request.get_json()
        if 'exam' not in data:
            print("Invalid parameters request")
            return jsonify({"message": "Invalid parameters"}), 400

        exam = data['exam']

        with Session() as session:
            is_duplicate = session.query(Exam).filter(and_(
                Exam.course_id == exam['course_id'],
                Exam.exam_date == exam['exam_date'],
                Exam.exam_type == exam['exam_type']
            )).first()

            if is_duplicate is None:
                print("Exam date: ", exam['exam_date'])
                exam_obj = Exam(
                    course_id=exam['course_id'],
                    exam_date=exam['exam_date'],
                    exam_type=exam['exam_type'],
                    max_marks=exam['max_marks']
                )
                try:
                    session.add(exam_obj)
                    session.commit()
                    return jsonify({"message": "Exam uploaded successfully"}), 200

                except Exception as e:
                    session.rollback()
                    print("Error occured while uploading exam details:", str(e))
                    return jsonify({"message": "Failed to upload exam"}), 500
            else:
                print("Exam details already exists")
                return jsonify({"message": "Exam details already exists"}), 400


@bp.route('/update', methods=['PUT'])
def update_exam():
    if request.method == 'PUT':
        data = request.get_json()
        if 'exam' not in data:
            return jsonify({"message": "Invalid parameter request"}), 400

        exam = data['exam']

        with Session() as session:
            try:
                exam_obj = session.query(Exam).filter(Exam.exam_id == exam.id).first()

                if exam_obj:
                    exam_obj.course_id = exam.course_id
                    exam_obj.exam_date = exam.exam_date
                    exam_obj.exam_type = exam.exam_type
                    exam_obj.max_marks = exam.max_marks
                    session.commit()
                    return jsonify({"message": "Exam details updated successfully"}), 200
                else:
                    return jsonify({"message": "Exam details not found"}), 400
            except Exception as e:
                session.rollback()
                return jsonify({"message": "Failed to update exam details"}), 500


@bp.route('/delete', methods=['DELETE'])
def delete_exam():
    if request.method == 'DELETE':
        if 'id' not in request.args:
            return jsonify({"message": "Invalid parameter request"}), 400
        id = request.args.get('id')
        with Session() as session:
            try:
                exam_obj = session.query(Exam).filter(Exam.exam_id == id).first()
                if exam_obj:
                    exam_obj.is_active = False
                    session.commit()
                    return jsonify({"message": "Exam deleted successfully"}), 200
                else:
                    return jsonify({"message": "Exam details not found in records"}), 400
            except Exception as e:
                session.rollback()
                return jsonify({"message": "Failed to delete exam details"}), 500
