export interface Department {
  key: string;
  label: string;
}

export interface NullFunction {
  (): null;
}

export interface StudentListType {
  id: string;
  name: string;
  date_of_birth: string;
}

export interface StudentType {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  age: string;
  date_of_birth: string;
  gender: string;
  address: string;
  department_id: string;
  department: string;
  enrollment_date: string;
  status: string;
  courses: string[];
  courses_id: string[];
}

export interface FacultyType {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  age: string;
  date_of_birth: string;
  gender: string;
  department_id: string;
  department: string;
  hire_date: string;
  status: string;
}

export interface AttendanceType {
  department: string;
  department_id: string;
  course: string;
  course_id: string;
  attendance_date: string;
  student_ids: string[];
}

export interface CourseType {
  id: string;
  course_name: string;
  course_code: string;
  credits: string;
  department_id: string;
  department: string;
}

export interface Key {
  key: string;
  label: string;
}

export interface AttendaceListType {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  department: string;
  department_id: string;
  course: string;
  course_id: string;
  attendance_date: string;
  status: string;
}

export interface ClassType {
  id: string;
  room_number: string;
  course_id: string;
  course: string;
  faculty_id: string;
  faculty: string;
  schedule_time: string;
}

export interface ExamType {
  id: string; //
  course_id: string; //
  course: string;
  exam_date: string;
  exam_type: string; //
  max_marks: string; //
}
