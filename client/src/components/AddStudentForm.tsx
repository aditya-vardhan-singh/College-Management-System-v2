/* Imports */
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { baseUrl, findAge } from "../data/utils";
import {
  StudentType,
  Department,
  NullFunction,
  CourseType,
} from "../TypeHints";

interface StudentFormProps {
  isOpen: NullFunction;
  onClose: NullFunction;
  onOpenChange: NullFunction;
}

export default function AddStudentForm({
  isOpen,
  onClose,
  onOpenChange,
}: StudentFormProps) {
  // Student details from form
  const [student, setStudent] = useState<StudentType>({
    id: "",
    first_name: "",
    last_name: "",
    gender: "",
    email: "",
    phone: "",
    age: "",
    date_of_birth: "",
    address: "",
    department_id: "",
    department: "",
    enrollment_date: "",
    status: "pending",
    courses: [""],
    courses_id: [""],
  });

  // Genders list
  const genders = [
    { key: "Male", label: "Male" },
    { key: "Female", label: "Female" },
  ];

  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  // Departments list
  const [departments, setDepartments] = useState<Department[]>([
    {
      key: "",
      label: "",
    },
  ]);

  // Course list
  const [courses, setCourses] = useState<{ key: string; label: string }[]>([
    {
      key: "",
      label: "",
    },
  ]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(baseUrl + "/departments/all");
      if (response?.data?.departments) {
        setDepartments(response.data.departments);
      }
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error("Unable to get departments list.");
      } else {
        toast.error("Unexpected error occurred. Please try again later.");
      }
    }
  };

  const fetchCourses = async (departmentId: string) => {
    try {
      // Fetch all courses in respective department
      const response: { data: { courses: CourseType[] } } = await axios.get(
        `${baseUrl}/courses/by-department`,
        { params: { department_id: departmentId } },
      );
      // If successful in getting departments, set variable value.
      if (response?.data?.courses) {
        const coursesList = response.data.courses.map((course) => ({
          key: course.id,
          label: course.course_name,
        }));
        setCourses(coursesList);
      }
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error("Error occurred fetching courses records");
      } else {
        toast.error(
          "Unexpected error occurred while fetching courses records. Please try again later.",
        );
      }
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDepartmentChange = async (value: string) => {
    setSelectedDepartment(value);
    setSelectedCourses("");
    setCourses([]);

    // Update department id and name in student details
    // setAttendance((prev) => ({
    //   ...prev,
    //   department_id: value,
    //   department: departments.find((dept) => dept.key === value)?.label || "",
    //   course_id: "",
    //   course: "",
    // }));
    setStudent((prev) => ({
      ...prev,
      department_id: value,
      department: departments.find((dept) => dept.key === value)?.label || "",
      courses: [""],
      courses_id: [""],
    }));
    await fetchCourses(value);
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setSelectedCourses(values);

    // Update course name in student details
    setStudent((prev) => ({
      ...prev,
      courses_id: values,
      courses: values.map(
        (courseKey) =>
          courses.find((course) => course.key === courseKey)?.label || "",
      ),
    }));
  };

  // const handleCourseChange = (values: string[]) => {
  //   setSelectedCourses(values);

  //   // Update course name in student details
  //   setStudent((prev) => ({
  //     ...prev,
  //     courses_id: values,
  //     // course: courses.find((course) => course.key === value)?.label || "",
  //     courses: values.map(
  //       (courseKey) =>
  //         courses.find((course) => course.key === courseKey)?.label || "",
  //     ),
  //   }));
  // };

  // Fetch departments as soon as page loads
  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAddStudentSubmit = async () => {
    // e: React.FormEvent<HTMLFormElement>,
    // e.preventDefault();

    // Set department name from department id
    const getDepartment = departments.filter((dept) => {
      return dept.key == student.department_id;
    });

    if (getDepartment.length > 0) {
      student.department = getDepartment[0].label;
    }

    // Derive age from date of birth
    student.age = String(findAge(new Date(student.date_of_birth)));

    // API call to store student to database
    try {
      const response = await axios.post(`${baseUrl}/students/add`, {
        student: student,
      });
      toast.success(
        response?.data?.message || "New student added successfully.",
      );
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(
          err?.response?.data?.message + ": " + err?.response?.data?.error ||
            "Error adding new student",
        );
      } else {
        toast.error("An unexpected error occured. Please try later.");
      }
    }

    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        size="5xl"
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleAddStudentSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                New Student
              </ModalHeader>
              <ModalBody>
                <Toaster richColors position="bottom-center" />
                <div className="grid grid-cols-6 gap-4">
                  {/* <div className="col-span-6">
                    {student.id !== "" && (
                      <Input
                        name="id"
                        isReadOnly
                        type="none"
                        label="Student ID"
                        labelPlacement="inside"
                        defaultValue={student.id}
                        style={{ borderWidth: 0, boxShadow: "none" }}
                      />
                    )}
                  </div> */}
                  <p className="col-span-6 text-base">Personal details:</p>
                  <Input
                    isRequired
                    required
                    className="col-span-3"
                    type="text"
                    maxLength={50}
                    autoComplete="first_name"
                    label="First Name"
                    labelPlacement="inside"
                    value={student.first_name}
                    onChange={(e) =>
                      setStudent((prev: StudentType) => {
                        return { ...prev, first_name: e.target.value };
                      })
                    }
                    // style={{ borderWidth: 0, boxShadow: "none" }}
                  />
                  <Input
                    isRequired
                    required
                    className="col-span-3"
                    type="text"
                    maxLength={50}
                    autoComplete="last_name"
                    label="Last Name"
                    labelPlacement="inside"
                    defaultValue={student.last_name}
                    onChange={(e) =>
                      setStudent((prev: StudentType) => {
                        return { ...prev, last_name: e.target.value };
                      })
                    }
                  />
                  <Select
                    isRequired
                    required
                    label="Gender"
                    className="max-w-xs col-span-2"
                    defaultSelectedKeys={[student.gender]}
                    onChange={(e) =>
                      setStudent((prev: StudentType) => {
                        return { ...prev, gender: e.target.value };
                      })
                    }
                  >
                    {genders.map((gender) => (
                      <SelectItem key={gender.key}>{gender.label}</SelectItem>
                    ))}
                  </Select>
                  <Input
                    className="col-span-2"
                    isRequired
                    required
                    isClearable
                    type="email"
                    maxLength={100}
                    autoComplete="email"
                    label="Email"
                    labelPlacement="inside"
                    defaultValue={student.email}
                    onChange={(e) =>
                      setStudent((prev: StudentType) => {
                        return { ...prev, email: e.target.value };
                      })
                    }
                  />
                  <Input
                    className="col-span-2"
                    type="number"
                    maxLength={15}
                    autoComplete="phone"
                    label="Phone"
                    defaultValue={student.phone}
                    onChange={(e) =>
                      setStudent((prev: StudentType) => {
                        return { ...prev, phone: e.target.value };
                      })
                    }
                    labelPlacement="inside"
                  />
                  <Input
                    className="col-span-2"
                    isRequired
                    required
                    type="date"
                    label="Date of Birth"
                    defaultValue={student.date_of_birth}
                    onChange={(e) =>
                      setStudent((prev: StudentType) => {
                        return {
                          ...prev,
                          date_of_birth: e.target.value.split("T")[0],
                        };
                      })
                    }
                    labelPlacement="inside"
                  />
                  <Input
                    className="col-span-4"
                    type="none"
                    maxLength={500}
                    label="Address"
                    defaultValue={student.address}
                    onChange={(e) =>
                      setStudent((prev: StudentType) => {
                        return { ...prev, address: e.target.value };
                      })
                    }
                    labelPlacement="inside"
                  />
                  <p className="col-span-6 text-base">Academic details:</p>
                  <Input
                    className="col-span-2"
                    isRequired
                    required
                    type="date"
                    label="Enrollment Date"
                    defaultValue={student.enrollment_date}
                    onChange={(e) =>
                      setStudent((prev: StudentType) => {
                        return { ...prev, enrollment_date: e.target.value };
                      })
                    }
                    labelPlacement="inside"
                  />
                  {/* <Select
                    isRequired
                    required
                    label="Select Department"
                    className="max-w-xs col-span-2"
                    defaultSelectedKeys={[student.department_id]}
                    onChange={(e) =>
                      setStudent((prev: StudentType) => {
                        return { ...prev, department_id: e.target.value };
                      })
                    }
                  >
                    {departments.map((department) => (
                      <SelectItem key={department.key}>
                        {department.label}
                      </SelectItem>
                    ))}
                  </Select> */}
                  <Select
                    isRequired
                    label="Select Department"
                    className="max-w-xs col-span-2"
                    value={selectedDepartment}
                    onChange={(e) => handleDepartmentChange(e.target.value)}
                  >
                    {departments.map((department) => (
                      <SelectItem key={department.key} value={department.key}>
                        {department.label}
                      </SelectItem>
                    ))}
                  </Select>

                  {selectedDepartment && (
                    <Select
                      isRequired
                      selectionMode="multiple"
                      label="Select Course"
                      className="max-w-xs col-span-2"
                      defaultSelectedKeys={"all"}
                      value={selectedCourses}
                      // onChange={(values) => handleCourseChange(values)}
                      onSelectionChange={(keys) =>
                        handleCourseChange({
                          target: {
                            selectedOptions: Array.from(keys).map((k) => ({
                              value: k,
                            })),
                          },
                        } as any)
                      }
                    >
                      {courses.map((course) => (
                        <SelectItem key={course.key} value={course.key}>
                          {course.label}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit">
                  Add
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
