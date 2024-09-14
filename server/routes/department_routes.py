from datetime import datetime
from flask import Blueprint, request, jsonify
from routes.utils import department_to_json
from schema.utils import Session
from schema.college_models import Department, Student

bp = Blueprint('departments', __name__, url_prefix='/departments')


@bp.route('/get-all', methods=['GET'])
def get_departments():
    '''
    PARAMS:
        None
    RETURN:
        interface Department {
          key: string;
          label: string;
        }
    '''
    session = Session()
    try:
        departments = session.query(Department).limit(100).all()
        departments_list = [
            {"key": dept.department_id, "label": dept.department_name}
            for dept in departments
        ]
        return jsonify({"departments": departments_list}), 200
    except Exception as e:
        session.rollback()
        return {"error": "Error getting departments list"}, 500
    finally:
        session.close()
