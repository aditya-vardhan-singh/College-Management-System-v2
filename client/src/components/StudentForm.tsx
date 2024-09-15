/* Imports */
import {
  Input,
  Select,
  SelectItem,
  ModalFooter,
  ModalBody,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { Toaster, toast } from "sonner";
import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../data/utils";

/* Typehints */
import { StudentType } from "./StudentTable";

interface Department {
  key: string;
  label: string;
}

interface NullFunction {
  (): null;
}

interface StudentFormProps {
  isOpen: NullFunction;
  onClose: NullFunction;
  onOpenChange: NullFunction;
}

export default function StudentForm({
  isOpen,
  onClose,
  onOpenChange,
}: StudentFormProps) {
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

  const [student, setStudent] = useState<StudentType>({
    id: "",
    primary_key: "",
    first_name: "",
    last_name: "",
    gender: "Male",
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

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAddStudentSubmit = async () => {
    // Set department name from department id
    const getDepartment = departments.filter((dept) => {
      return dept.key == student.department_id;
    });

    if (getDepartment.length > 0) {
      student.department = getDepartment[0].label;
    }

    if (
      student.first_name === "" ||
      student.last_name === "" ||
      student.gender === "" ||
      student.date_of_birth === "" ||
      student.department === "" ||
      student.enrollment_date === ""
    ) {
      toast.warning("Please enter all the required fields:");
      console.log(student);
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/students/add`, {
        student: student,
      });
      toast.success(
        response?.data?.message || "New student added successfully.",
      );
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(err?.response?.data?.message || "Error adding new student");
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
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New Student
              </ModalHeader>
              <ModalBody>
                <form>
                  <Toaster richColors position="bottom-center" />
                  <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-6">
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
                    </div>
                    <Input
                      className="col-span-3"
                      isRequired
                      type="none"
                      maxLength={50}
                      autoComplete="first_name"
                      label="First Name"
                      labelPlacement="inside"
                      defaultValue={student.first_name}
                      onChange={(e) =>
                        setStudent((prev: StudentType) => {
                          return { ...prev, first_name: e.target.value };
                        })
                      }
                      style={{ borderWidth: 0, boxShadow: "none" }}
                    />
                    <Input
                      className="col-span-3"
                      isRequired
                      type="none"
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
                      style={{ borderWidth: 0, boxShadow: "none" }}
                    />
                    <Select
                      isRequired
                      label="Gender"
                      className="max-w-xs col-span-2"
                      defaultSelectedKeys={[student.gender]}
                    >
                      {genders.map((gender) => (
                        <SelectItem key={gender.key}>{gender.label}</SelectItem>
                      ))}
                    </Select>
                    <Input
                      className="col-span-2"
                      isRequired
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
                      style={{ borderWidth: 0, boxShadow: "none" }}
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
                      style={{ borderWidth: 0, boxShadow: "none" }}
                    />
                    <Input
                      className="col-span-2"
                      isRequired
                      type="date"
                      label="Date of Birth"
                      defaultValue={student.date_of_birth}
                      onChange={(e) =>
                        setStudent((prev: StudentType) => {
                          return { ...prev, date_of_birth: e.target.value };
                        })
                      }
                      labelPlacement="inside"
                      style={{ borderWidth: 0, boxShadow: "none" }}
                    />
                    <Select
                      isRequired
                      label="Department"
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
                    </Select>
                    <Input
                      className="col-span-2"
                      isRequired
                      type="date"
                      label="Enrollment Date"
                      defaultValue={student.enrollment_date}
                      onChange={(e) =>
                        setStudent((prev: StudentType) => {
                          return { ...prev, enrollment_date: e.target.value };
                        })
                      }
                      labelPlacement="inside"
                      style={{ borderWidth: 0, boxShadow: "none" }}
                    />
                    <Input
                      className="col-span-6"
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
                      style={{ borderWidth: 0, boxShadow: "none" }}
                    />
                  </div>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    handleAddStudentSubmit();
                  }}
                >
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
