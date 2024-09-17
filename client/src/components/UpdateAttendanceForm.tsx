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
import { FacultyType, Department, NullFunction } from "../TypeHints";

interface FacultyFormProps {
  currentFacultyDetails: FacultyType;
  isOpen: NullFunction;
  onClose: NullFunction;
  onOpenChange: NullFunction;
}

export default function UpdateAttendanceForm({
  currentFacultyDetails,
  isOpen,
  onClose,
  onOpenChange,
}: FacultyFormProps) {
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
  const [faculty, setFaculty] = useState<FacultyType>({
    id: "",
    first_name: "",
    last_name: "",
    gender: "",
    email: "",
    phone: "",
    age: "",
    date_of_birth: "",
    department_id: "",
    department: "",
    hire_date: "",
    status: "pending",
  });

  // Fetch departments as soon as page loads
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Log departments after they are fetched
  useEffect(() => {
    setFaculty(currentFacultyDetails);
  }, [currentFacultyDetails]);

  // useEffect(() => {
  //   fetchDepartments();

  //   // Find default department based on department_id
  //   let defaultDepartment;
  //   if (currentFacultyDetails.department_id) {
  //     defaultDepartment = departments.find(
  //       (dept) => dept.key === currentFacultyDetails.department_id,
  //     );
  //   }

  //   // Set faculty details from currentFacultyDetails and default department
  //   setFaculty((prevStudent) => ({
  //     ...currentFacultyDetails,
  //     department: defaultDepartment?.label || "",
  //     department_id: defaultDepartment?.key || "",
  //   }));
  // }, [currentFacultyDetails, departments]);

  const handleUpdateFacultySubmit = async () => {
    // e: React.FormEvent<HTMLFormElement>,
    // e.preventDefault();

    // Set department name from department id
    const getDepartment = departments.filter((dept) => {
      return dept.key == faculty.department_id;
    });

    if (getDepartment.length > 0) {
      faculty.department = getDepartment[0].label;
    }

    // Derive age from date of birth
    faculty.age = String(findAge(new Date(faculty.date_of_birth)));

    // API call to store faculty to database
    try {
      const response = await axios.put(`${baseUrl}/faculties/update`, {
        faculty: faculty,
      });
      toast.success(response?.data?.message || "Faculty updated successfully.");
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(
          err?.response?.data?.message + ": " + err?.response?.data?.error ||
            "Error updating faculty",
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
            <form onSubmit={handleUpdateFacultySubmit}>
              <ModalHeader className="flex flex-col gap-1">
                Update Faculty
              </ModalHeader>
              <ModalBody>
                <Toaster richColors position="bottom-center" />
                <div className="grid grid-cols-6 gap-4">
                  <Input
                    name="id"
                    isReadOnly
                    type="number"
                    label="Faculty ID"
                    labelPlacement="inside"
                    value={faculty.id}
                    className="col-span-4"
                  />
                  <Select
                    isRequired
                    required
                    label="Enrollment Status"
                    className="max-w-xs col-span-2"
                    defaultSelectedKeys={[currentFacultyDetails.status]}
                    value={faculty.status}
                    onChange={(e) =>
                      setFaculty((prev: FacultyType) => {
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
                    defaultValue={currentFacultyDetails.first_name}
                    value={faculty.first_name}
                    onChange={(e) =>
                      setFaculty((prev: FacultyType) => {
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
                    defaultValue={currentFacultyDetails.last_name}
                    value={faculty.last_name}
                    onChange={(e) =>
                      setFaculty((prev: FacultyType) => {
                        return { ...prev, last_name: e.target.value };
                      })
                    }
                  />
                  <Select
                    isRequired
                    required
                    label="Gender"
                    className="max-w-xs col-span-2"
                    defaultSelectedKeys={[currentFacultyDetails.gender]}
                    value={faculty.gender}
                    onChange={(e) =>
                      setFaculty((prev: FacultyType) => {
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
                    defaultValue={currentFacultyDetails.email}
                    value={faculty.email}
                    onChange={(e) =>
                      setFaculty((prev: FacultyType) => {
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
                    defaultValue={currentFacultyDetails.phone}
                    value={faculty.phone}
                    onChange={(e) =>
                      setFaculty((prev: FacultyType) => {
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
                    defaultValue={currentFacultyDetails.date_of_birth}
                    value={faculty.date_of_birth}
                    onChange={(e) =>
                      setFaculty((prev: FacultyType) => {
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
                    defaultSelectedKeys={[currentFacultyDetails.department_id]}
                    value={faculty.department_id}
                    onChange={(e) =>
                      setFaculty((prev: FacultyType) => {
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
                    label="Hire Date"
                    defaultValue={currentFacultyDetails.hire_date}
                    value={faculty.hire_date}
                    onChange={(e) =>
                      setFaculty((prev: FacultyType) => {
                        return { ...prev, enrollment_date: e.target.value };
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
