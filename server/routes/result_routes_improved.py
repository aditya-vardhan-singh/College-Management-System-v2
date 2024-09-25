from flask import Blueprint
from flask_pydantic import validate
from pydantic import BaseModel
from schema.college_models import Session
from datetime import date

bp = Blueprint('results', __name__, url_prefix='/results')

class ResultResponse(BaseModel):
    id: int
    student_id: int
    student_first_name: str
    student_last_name: str
    exam_id: int
    exam_date: date
    course_id: int
    course_name: str
    marks_obtained: float


@bp.route('/all', methods=['GET'])
@validate()
def get_all_results(page: int = 1, per_page: int = 10):
    with Session() as session:
        try:
            pass
        except ValidationError as e:
            pass
        except Exception as e:
            pass
