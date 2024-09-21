import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  DateValue,
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
import { Toaster, toast } from "sonner";
import { baseUrl } from "../data/utils";
import {
  AttendanceType,
  CourseType,
  Department,
  NullFunction,
} from "../TypeHints";
import { AttendanceList } from "./AllComponents";
import { getLocalTimeZone, today } from "@internationalized/date";

interface FacultyFormProps {
  isOpen: NullFunction;
  onClose: NullFunction;
  onOpenChange: NullFunction;
}

export default function AddAttendanceForm({
  isOpen,
  onClose,
  onOpenChange,
}: FacultyFormProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<{ key: string; label: string }[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [attendanceDate, setAttendanceDate] = useState<DateValue>(
    today(getLocalTimeZone()),
  );
  const [attendance, setAttendance] = useState<AttendanceType>({
    department: "",
    department_id: "",
    course: "",
    course_id: "",
    attendance_date: `${today(getLocalTimeZone())}`,
    student_ids: [],
  });

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
    setSelectedCourse("");
    setCourses([]);

    // Update department id and name in student details
    setAttendance((prev) => ({
      ...prev,
      department_id: value,
      department: departments.find((dept) => dept.key === value)?.label || "",
      course_id: "",
      course: "",
    }));
    await fetchCourses(value);
  };

  const handleCourseChange = (value: string) => {
    setSelectedCourse(value);

    // Update course name in student details
    setAttendance((prev) => ({
      ...prev,
      course_id: value,
      course: courses.find((course) => course.key === value)?.label || "",
    }));
  };

  const handleAddAttendanceSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    // Set attendance date before passing
    attendance.attendance_date = `${attendanceDate.year}-${attendanceDate.month}-${attendanceDate.day}`;

    try {
      console.log(attendance);
      const response = await axios.post(`${baseUrl}/attendances/add`, {
        attendance,
      });
      toast.success(
        response?.data?.message || "New attendance added successfully.",
      );
      onClose();
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(
          err?.response?.data?.message || "Error adding new attendance",
        );
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const handleArrayFromList = (selectedStudents: string[]) => {
    setAttendance((prev) => ({
      ...prev,
      student_ids: selectedStudents,
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="5xl"
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleAddAttendanceSubmit}>
            <ModalHeader className="flex flex-col gap-1">
              Mark Attendance
            </ModalHeader>
            <ModalBody>
              <Toaster richColors position="bottom-center" />
              <div className="grid grid-cols-6 gap-4">
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
                    label="Select Course"
                    className="max-w-xs col-span-2"
                    value={selectedCourse}
                    onChange={(e) => handleCourseChange(e.target.value)}
                  >
                    {courses.map((course) => (
                      <SelectItem key={course.key} value={course.key}>
                        {course.label}
                      </SelectItem>
                    ))}
                  </Select>
                )}

                {selectedCourse && (
                  <>
                    <DatePicker
                      label="Date"
                      className="max-w-full col-span-2"
                      maxValue={today(getLocalTimeZone())}
                      value={attendanceDate}
                      onChange={setAttendanceDate}
                    />
                    <div className="col-span-6">
                      <AttendanceList
                        course_id={attendance.course_id}
                        sendStudentListToParent={handleArrayFromList}
                      />
                    </div>
                  </>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              {selectedCourse && (
                <>
                  <Button
                    color="primary"
                    type="submit"
                    disabled={!selectedCourse}
                  >
                    Mark
                  </Button>
                </>
              )}
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
