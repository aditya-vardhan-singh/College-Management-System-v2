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
  Selection,
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
  Key,
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
    status: "admitted",
    courses: [],
    courses_id: [],
  });

  // Genders list
  const genders = [
    { key: "Male", label: "Male" },
    { key: "Female", label: "Female" },
  ];

  // Departments list
  const [departments, setDepartments] = useState<Key[]>([
    {
      key: "",
      label: "",
    },
  ]);
  const [selectedDepartment, setSelectedDepartment] = useState<Selection>(
    new Set([""]),
  );

  // Course list
  const [courses, setCourses] = useState<{ key: string; label: string }[]>([
    {
      key: "",
      label: "",
    },
  ]);
  const [selectedCourses, setSelectedCourses] = useState<Selection>(
    new Set([""]),
  );

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
      const response: { data: { courses: CourseType[] } } = await axios.get(
        `${baseUrl}/courses/by-department`,
        { params: { department_id: departmentId } },
      );
      if (response?.data?.courses) {
        const coursesList = response.data.courses.map((course) => ({
          key: course.id,
          label: course.course_name,
        }));
        setCourses(coursesList);

        // Update student details with all courses
        setStudent((prev) => ({
          ...prev,
          // courses: coursesList.map((value) => value.label),
          courses_id: coursesList.map((value) => `${value.key}`),
        }));
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

  // const handleDepartmentChange = async (
  //   e: React.ChangeEvent<HTMLSelectElement>,
  // ) => {
  //   const value = e.target.value;
  //   setStudent((prev) => ({
  //     ...prev,
  //     department_id: value,
  //     department: departments.find((dept) => dept.key === value)?.label || "",
  //   }));
  //   await fetchCourses(value);
  // };

  // const handleCourseChange = (keys: Set<Key>) => {
  //   setSelectedCourses(keys);
  //   const selectedCourseIds = Array.from(keys) as string[];
  //   const selectedCourseNames = selectedCourseIds.map(
  //     (id) => courses.find((course) => course.key === id)?.label || "",
  //   );

  //   setStudent((prev) => ({
  //     ...prev,
  //     courses_id: selectedCourseIds,
  //     courses: selectedCourseNames,
  //   }));
  // };

  // Fetch departments as soon as page loads
  useEffect(() => {
    fetchDepartments();
  }, []);

  // useEffect(() => {
  //   const getSelectedDepartment = () => {
  //     // Convert the Set to an array and get the first (and only) element
  //     const selectedKey = Array.from(selectedDepartment)[0];

  //     // Find the department object in the departments array that matches the selected key
  //     const selected = departments.find((dept) => dept.key === selectedKey);

  //     // Return the selected department, or null if not found
  //     return selected || null;
  //   };
  //   setStudent((prev) => ({
  //     ...prev,
  //     department_id: getSelectedDepartment?.key,
  //     department: getSelectedDepartment?.label,
  //   }));
  //   console.log(student.department_id);
  // }, [departments, selectedDepartment, setSelectedDepartment]);

  // useEffect(() => {
  //   const getSelectedCoursesKeys = () => {
  //     // Convert the Set to an array and get the first (and only) element
  //     const selectedKeys = Array.from(selectedDepartment);

  //     // Find the department object in the departments array that matches the selected key
  //     const selected: Key[] | undefined = [];
  //     selectedKeys.forEach((key) => {
  //       selected.push(courses.find((course) => course.key === key)?.key);
  //     });

  //     // Return the selected department, or null if not found
  //     return selected || null;
  //   };
  //   const getSelectedCoursesLabels = () => {
  //     // Convert the Set to an array and get the first (and only) element
  //     const selectedKeys = Array.from(selectedDepartment);

  //     // Find the department object in the departments array that matches the selected key
  //     const selected: Key[] | undefined = [];
  //     selectedKeys.forEach((key) => {
  //       selected.push(courses.find((course) => course.key === key)?.label);
  //     });

  //     // Return the selected department, or null if not found
  //     return selected || null;
  //   };
  //   setStudent((prev) => ({
  //     ...prev,
  //     courses_id: getSelectedCoursesKeys,
  //     courses: getSelectedCoursesLabels,
  //   }));
  // }, [departments, selectedDepartment, setSelectedDepartment]);

  const handleAddStudentSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    // Set department name from department id
    const getDepartmentLabel = departments.filter((dept) => {
      return dept.key == student.department_id;
    })[0].label;

    if (getDepartmentLabel.length > 0) {
      student.department = getDepartmentLabel;
    }

    // Set courses name from course ids
    const getCourseLabels = student.courses_id.map((course_id) => {
      return courses.filter((course) => course.key == course_id)[0].label;
    });

    if (getCourseLabels.length > 0) {
      student.courses = getCourseLabels;
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
                      <SelectItem key={gender.key} textValue={gender.label}>
                        {gender.label}
                      </SelectItem>
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
                    type="text"
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
                  <Select
                    isRequired
                    required
                    label="Select Department"
                    className="max-w-xs col-span-2"
                    selectedKeys={
                      student.department_id ? [student.department_id] : []
                    }
                    onSelectionChange={async (keys) => {
                      const selectedKeys = Array.from(keys)[0];
                      if (typeof selectedKeys === "string") {
                        setStudent((prev) => ({
                          ...prev,
                          department_id: selectedKeys,
                        }));
                        await fetchCourses(selectedKeys);
                      }
                    }}
                  >
                    {departments.map((department) => (
                      <SelectItem key={department.key}>
                        {department.label}
                      </SelectItem>
                    ))}
                  </Select>

                  {student.department_id && (
                    <Select
                      isRequired
                      required
                      selectionMode="multiple"
                      label="Select Course"
                      className="max-w-xs col-span-2"
                      selectedKeys={student.courses_id}
                      onSelectionChange={(keys) => {
                        const selectedKeys = Array.from(keys);
                        console.log(selectedKeys);
                        setStudent((prev) => ({
                          ...prev,
                          courses_id: selectedKeys as string[],
                        }));
                      }}
                    >
                      {courses.map((course) => (
                        <SelectItem key={course.key}>{course.label}</SelectItem>
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
