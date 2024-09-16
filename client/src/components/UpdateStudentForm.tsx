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
import { StudentType, Department, NullFunction } from "../TypeHints";

interface StudentFormProps {
  currentStudentDetails: StudentType;
  isOpen: NullFunction;
  onClose: NullFunction;
  onOpenChange: NullFunction;
}

export default function UpdateStudentForm({
  currentStudentDetails,
  isOpen,
  onClose,
  onOpenChange,
}: StudentFormProps) {
  // Genders list
  const genders = [
    { key: "Male", label: "Male" },
    { key: "Female", label: "Female" },
  ];

  const statuses = [
    { key: "pending", label: "Pending" },
    { key: "admitted", label: "Admitted" },
    { key: "left", label: "Left" },
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
  });

  // Fetch departments as soon as page loads
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Log departments after they are fetched
  useEffect(() => {
    setStudent(currentStudentDetails);
  }, [currentStudentDetails]);

  // useEffect(() => {
  //   fetchDepartments();

  //   // Find default department based on department_id
  //   let defaultDepartment;
  //   if (currentStudentDetails.department_id) {
  //     defaultDepartment = departments.find(
  //       (dept) => dept.key === currentStudentDetails.department_id,
  //     );
  //   }

  //   // Set student details from currentStudentDetails and default department
  //   setStudent((prevStudent) => ({
  //     ...currentStudentDetails,
  //     department: defaultDepartment?.label || "",
  //     department_id: defaultDepartment?.key || "",
  //   }));
  // }, [currentStudentDetails, departments]);

  const handleUpdateStudentSubmit = async () => {
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
      const response = await axios.put(`${baseUrl}/students/update`, {
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
            <form onSubmit={handleUpdateStudentSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                New Student
              </ModalHeader>
              <ModalBody>
                <Toaster richColors position="bottom-center" />
                <div className="grid grid-cols-6 gap-4">
                  <Input
                    name="id"
                    isReadOnly
                    type="number"
                    label="Student ID"
                    labelPlacement="inside"
                    value={student.id}
                    className="col-span-4"
                  />
                  <Select
                    isRequired
                    required
                    label="Enrollment Status"
                    className="max-w-xs col-span-2"
                    defaultSelectedKeys={[currentStudentDetails.status]}
                    value={student.status}
                    onChange={(e) =>
                      setStudent((prev: StudentType) => {
                        return { ...prev, status: e.target.value };
                      })
                    }
                  >
                    {statuses.map((status) => (
                      <SelectItem key={status.key}>{status.label}</SelectItem>
                    ))}
                  </Select>
                  <Input
                    isRequired
                    required
                    className="col-span-3"
                    type="text"
                    maxLength={50}
                    autoComplete="first_name"
                    label="First Name"
                    labelPlacement="inside"
                    defaultValue={currentStudentDetails.first_name}
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
                    defaultValue={currentStudentDetails.last_name}
                    value={student.last_name}
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
                    defaultSelectedKeys={[currentStudentDetails.gender]}
                    value={student.gender}
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
                    defaultValue={currentStudentDetails.email}
                    value={student.email}
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
                    defaultValue={currentStudentDetails.phone}
                    value={student.phone}
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
                    defaultValue={currentStudentDetails.date_of_birth}
                    value={student.date_of_birth}
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
                  <Select
                    isRequired
                    required
                    label="Department"
                    className="max-w-xs col-span-2"
                    defaultSelectedKeys={[currentStudentDetails.department_id]}
                    value={student.department_id}
                    onChange={(e) =>
                      setStudent((prev: StudentType) => {
                        return { ...prev, department_id: e.target.value };
                      })
                    }
                  >
                    {departments.map((dept) => (
                      <SelectItem key={dept.key}>{dept.label}</SelectItem>
                    ))}
                  </Select>
                  <Input
                    className="col-span-2"
                    isRequired
                    required
                    type="date"
                    label="Enrollment Date"
                    defaultValue={currentStudentDetails.enrollment_date}
                    value={student.enrollment_date}
                    onChange={(e) =>
                      setStudent((prev: StudentType) => {
                        return { ...prev, enrollment_date: e.target.value };
                      })
                    }
                    labelPlacement="inside"
                  />
                  <Input
                    className="col-span-6"
                    type="none"
                    maxLength={500}
                    label="Address"
                    defaultValue={currentStudentDetails.address}
                    value={student.address}
                    onChange={(e) =>
                      setStudent((prev: StudentType) => {
                        return { ...prev, address: e.target.value };
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
                  Update
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
