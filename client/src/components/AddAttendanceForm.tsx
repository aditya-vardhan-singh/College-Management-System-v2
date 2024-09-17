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
import { AttendanceType, Department, NullFunction } from "../TypeHints";

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
  // Genders list
  const genders = [
    { key: "Male", label: "Male" },
    { key: "Female", label: "Female" },
  ];

  // Departments list
  const [departments, setDepartments] = useState<Department[]>([
    {
      key: "",
      label: "",
    },
  ]);

  // Fetch departments from database
  const fetchDepartments = async () => {
    try {
      const response: { data: { departments: Department[] } } = await axios.get(
        baseUrl + "/departments/all",
      );
      if (response?.data?.departments) {
        setDepartments(response.data.departments);
      }
    } catch (err: { response: { data: { message: string } } }) {
      if (axios.isAxiosError(err)) {
        toast.error(
          err?.response?.data?.message || "Unable to get departments list!",
        );
      } else {
        toast.error("An unexptected error occured. Please try again later.");
      }
    }
  };

  // Fetch departments as soon as page loads
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Student details from form
  const [attendance, setAttendance] = useState<AttendanceType>({
    id: "",
    student: {
      id: "",
      first_name: "",
      last_name: "",
      department: "",
      department_id: "",
    },
    course: "",
    attendance_date: "",
    status: "",
  });

  const handleAddFacultySubmit = async () => {
    // e: React.FormEvent<HTMLFormElement>,
    // e.preventDefault();

    // Set department name from department id
    const getDepartment = departments.filter((dept) => {
      return dept.key == attendance.student.department_id;
    });

    if (getDepartment.length > 0) {
      attendance.student.department = getDepartment[0].label;
    }

    // Derive age from date of birth
    // attendance.age = String(findAge(new Date(attendance.date_of_birth)));

    // API call to store attendance to database
    try {
      const response = await axios.post(`${baseUrl}/faculties/add`, {
        attendance: attendance,
      });
      toast.success(
        response?.data?.message || "New attendance added successfully.",
      );
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(
          err?.response?.data?.message + ": " + err?.response?.data?.error ||
            "Error adding new attendance",
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
            <form onSubmit={handleAddFacultySubmit}>
              <ModalHeader className="flex flex-col gap-1">
                Mark Attendance
              </ModalHeader>
              <ModalBody>
                <Toaster richColors position="bottom-center" />
                <div className="grid grid-cols-6 gap-4">
                  {/* <div className="col-span-6">
                    {attendance.id !== "" && (
                      <Input
                        name="id"
                        isReadOnly
                        type="none"
                        label="Student ID"
                        labelPlacement="inside"
                        defaultValue={attendance.id}
                        style={{ borderWidth: 0, boxShadow: "none" }}
                      />
                    )}
                  </div> */}
                  <Input
                    isRequired
                    required
                    className="col-span-3"
                    type="text"
                    maxLength={50}
                    autoComplete="first_name"
                    label="First Name"
                    labelPlacement="inside"
                    value={attendance.first_name}
                    onChange={(e) =>
                      setAttendance((prev: FacultyType) => {
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
                    defaultValue={attendance.last_name}
                    onChange={(e) =>
                      setAttendance((prev: FacultyType) => {
                        return { ...prev, last_name: e.target.value };
                      })
                    }
                  />
                  <Select
                    isRequired
                    required
                    label="Gender"
                    className="max-w-xs col-span-2"
                    defaultSelectedKeys={[attendance.gender]}
                    onChange={(e) =>
                      setAttendance((prev: FacultyType) => {
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
                    defaultValue={attendance.email}
                    onChange={(e) =>
                      setAttendance((prev: FacultyType) => {
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
                    defaultValue={attendance.phone}
                    onChange={(e) =>
                      setAttendance((prev: FacultyType) => {
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
                    defaultValue={attendance.date_of_birth}
                    onChange={(e) =>
                      setAttendance((prev: FacultyType) => {
                        return {
                          ...prev,
                          date_of_birth: e.target.value.split("T")[0],
                        };
                      })
                    }
                    labelPlacement="inside"
                  />
                  <Select
                    isRequired
                    required
                    label="Department"
                    className="max-w-xs col-span-2"
                    defaultSelectedKeys={[attendance.department_id]}
                    onChange={(e) =>
                      setAttendance((prev: FacultyType) => {
                        return { ...prev, department_id: e.target.value };
                      })
                    }
                  >
                    {departments.map((department) => (
                      <SelectItem key={department.key}>
                        {department.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    className="col-span-2"
                    isRequired
                    required
                    type="date"
                    label="Enrollment Date"
                    defaultValue={attendance.hire_date}
                    onChange={(e) =>
                      setAttendance((prev: FacultyType) => {
                        return { ...prev, hire_date: e.target.value };
                      })
                    }
                    labelPlacement="inside"
                  />
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
