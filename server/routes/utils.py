from schema.college_models import Department, Student
from datetime import datetime

def student_to_json(student: Student):
    print(student.student_id)


def department_to_json(department: Department):
    pass

def calculate_age(date_of_birth_str: str) -> str:
    # Parse the string into a datetime object
    date_of_birth = datetime.strptime(date_of_birth_str, "%Y-%m-%d")

    # Get today's date
    today = datetime.today()

    # Calculate the difference in years
    age = today.year - date_of_birth.year

    # Adjust if the birthday has not occurred yet this year
    if today.month < date_of_birth.month or (today.month == date_of_birth.month and today.day < date_of_birth.day):
        age -= 1

    return str(age)
