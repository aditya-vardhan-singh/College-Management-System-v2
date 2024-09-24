from sqlalchemy.sql import and_
from flask import Blueprint, request, jsonify
from schema.utils import Session
from schema.college_models import Exam, Result

bp = Blueprint('results', __name__, url_prefix='/results')


@bp.route('/all', methods=['GET'])
def get_exams():
    if request.method == 'GET':
        session = Session()
        try:
            results = session.query(Result).limit(100).all()
            if results is None:
                print("No record found")
                return jsonify({"results": []}), 200
            else:
                results_list = [
                    {
                        "id": result.result_id,
                        "student_id": result.student_id,
                        "student_first_name": result.student.first_name,
                        "student_last_name": result.student.last_name,
                        "exam_id": result.exam_id,
                        "exam_date": result.exam.exam_date,
                        "course_id": result.course_id,
                        "course_name": result.course.course_name,
                        "marks_obtained": result.marks_obtained,
                    }
                    for result in results if result.is_active
                ]
                return jsonify({"results": results_list}), 200
        except Exception as e:
            session.rollback()
            print("Error getting result records: ", str(e))
            return jsonify({"message": "Error getting result records"}), 500
        finally:
            session.close()


@bp.route('/add', methods=['POST'])
def add_exams():
    if request.method == 'POST':
        data = request.get_json()
        if 'result' not in data:
            print("Invalid parameters request")
            return jsonify({"message": "Invalid parameters"}), 400

        result = data['result']

        with Session() as session:
            try:
                # Check if result details already exist on database
                is_duplicate = session.query(Result).filter(and_(
                    Result.student_id == result['student_id'],
                    Result.exam_id == result['exam_id'],
                )).first()

                # If they don't exist
                if is_duplicate is None:
                    exam_obj = session.query(Exam).filter(Exam.exam_id == result['exam_id']).first()
                    if exam_obj:
                        course_id = exam_obj.course_id
                        result_obj = Result(
                            student_id=result['student_id'],
                            exam_id=result['exam_id'],
                            course_id=course_id,
                            marks_obtained=result['marks_obtained']
                        )
                    else:
                        print("Exam details not found")
                        return jsonify({"message": "Exam details not found"}), 404

                    session.add(result_obj)
                    session.commit()
                    return jsonify({"message": "Result uploaded successfully"}), 200

                # If they exist
                else:
                    print("Result details already exists")
                    return jsonify({"message": "Result details already exists"}), 400

            except Exception as e:
                session.rollback()
                print("Error occured while uploading result details:", str(e))
                return jsonify({"message": "Failed to upload result"}), 500


@bp.route('/update', methods=['PUT'])
def update_exam():
    if request.method == 'PUT':
        data = request.get_json()
        if 'result' not in data:
            return jsonify({"message": "Invalid parameter request"}), 400

        result = data['result']

        with Session() as session:
            try:
                result_obj = session.query(Result).filter(Result.result_id == result.id).first()

                if result_obj:
                    result_obj.student_id = result.student_id
                    result_obj.exam_id = result.exam_id
                    result_obj.course_id = result.course_id
                    result_obj.marks_obtained = result.marks_obtained
                    session.commit()
                    return jsonify({"message": "Result details updated successfully"}), 200
                else:
                    return jsonify({"message": "Result details not found"}), 400
            except Exception as e:
                session.rollback()
                print("Error occured while updating result details: ", str(e))
                return jsonify({"message": "Error occured while updating result details"}), 500


@bp.route('/delete', methods=['DELETE'])
def delete_exam():
    if request.method == 'DELETE':
        if 'id' not in request.args:
            return jsonify({"message": "Invalid parameter request"}), 400
        id = request.args.get('id')
        with Session() as session:
            try:
                result_obj = session.query(Result).filter(Result.result_id == id).first()
                if result_obj:
                    result_obj.is_active = False
                    session.commit()
                    return jsonify({"message": "Result deleted successfully"}), 200
                else:
                    return jsonify({"message": "Result details not found in records"}), 400
            except Exception as e:
                session.rollback()
                return jsonify({"message": "Failed to delete result details"}), 500
