export interface Department {
  key: string;
  label: string;
}

export interface NullFunction {
  (): null;
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
