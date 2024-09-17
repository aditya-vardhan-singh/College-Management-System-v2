// BUG IN THIS FILE
// LINE NUMBER: #309

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
import { baseUrl } from "../data/utils";
import { CourseType, Department, NullFunction } from "../TypeHints";

interface StudentFormProps {
  currentCourseDetails: CourseType;
  isOpen: NullFunction;
  onClose: NullFunction;
  onOpenChange: NullFunction;
}

export default function UpdateCourseForm({
  currentCourseDetails,
  isOpen,
  onClose,
  onOpenChange,
}: StudentFormProps) {
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

  // Course details from form
  const [course, setCourse] = useState<CourseType>({
    id: "",
    course_name: "",
    course_code: "",
    credits: "",
    department_id: "",
    department: "",
  });

  // Fetch departments as soon as page loads
  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    setCourse(currentCourseDetails);
  }, [currentCourseDetails]);

  const handleUpdateStudentSubmit = async () => {
    // API call to update course in database
    try {
      const response = await axios.put(`${baseUrl}/courses/update`, {
        course: course,
      });
      toast.success(response?.data?.message || "Course updated successfully.");
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(err?.response?.data?.message || "Error updating course");
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
                Update Course
              </ModalHeader>
              <ModalBody>
                <Toaster richColors position="bottom-center" />
                <div className="grid grid-cols-6 gap-4 ">
                  <Input
                    isReadOnly
                    className="col-span-2"
                    type="text"
                    maxLength={50}
                    autoComplete="course_id"
                    label="Course ID"
                    labelPlacement="inside"
                    defaultValue={currentCourseDetails.id}
                    value={course.id}
                    onChange={(e) =>
                      setCourse((prev: CourseType) => {
                        return { ...prev, id: e.target.value };
                      })
                    }
                  />
                  <Input
                    isRequired
                    required
                    className="col-span-4"
                    type="text"
                    maxLength={50}
                    autoComplete="course_name"
                    label="Course Name"
                    labelPlacement="inside"
                    defaultValue={currentCourseDetails.course_name}
                    value={course.course_name}
                    onChange={(e) =>
                      setCourse((prev: CourseType) => {
                        return { ...prev, course_name: e.target.value };
                      })
                    }
                    // style={{ borderWidth: 0, boxShadow: "none" }}
                  />
                  <Input
                    isRequired
                    required
                    className="col-span-2"
                    type="text"
                    maxLength={50}
                    autoComplete="course_code"
                    label="Course Code"
                    labelPlacement="inside"
                    defaultValue={currentCourseDetails.course_code}
                    onChange={(e) =>
                      setCourse((prev: CourseType) => {
                        return { ...prev, course_code: e.target.value };
                      })
                    }
                  />
                  <Select
                    isRequired
                    required
                    label="Department"
                    className="max-w-full col-span-2"
                    defaultSelectedKeys={[currentCourseDetails.department_id]}
                    value={course.department_id}
                    onChange={(e) =>
                      setCourse((prev: CourseType) => {
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
                    isRequired
                    required
                    className="col-span-2"
                    type="number"
                    maxLength={50}
                    autoComplete="credits"
                    label="Credits"
                    labelPlacement="inside"
                    defaultValue={currentCourseDetails.credits}
                    onChange={(e) =>
                      setCourse((prev: CourseType) => {
                        return { ...prev, credits: e.target.value };
                      })
                    }
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
