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
import {
  ClassType,
  NullFunction,
  Key,
  CourseType,
  Department,
  FacultyType,
} from "../TypeHints";

interface ClassFormProps {
  isOpen: NullFunction;
  onClose: NullFunction;
  onOpenChange: NullFunction;
}

export default function AddClassForm({
  isOpen,
  onClose,
  onOpenChange,
}: ClassFormProps) {
  // Class details from form
  const [classroom, setClassroom] = useState<ClassType>({
    id: "",
    room_number: "",
    course_id: "",
    course: "",
    faculty_id: "",
    faculty: "",
    schedule_time: "",
  });
  const [courses, setCourses] = useState<Key[]>([
    {
      key: "",
      label: "",
    },
  ]);
  const [faculties, setFaculties] = useState<Key[]>([
    {
      key: "",
      label: "",
    },
  ]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response: { data: { users: CourseType[] } } = await axios.get(
          `${baseUrl}/courses/all`,
        );
        if (response?.data?.users) {
          setCourses(
            response.data.users.map((course) => ({
              key: course.id,
              label: course.course_name,
            })),
          );
        }
      } catch (err) {
        if (isAxiosError(err)) {
          toast.error(
            err?.response?.data?.message ||
              "Error occured while fetching courses records",
          );
        } else {
          toast.error("Unexpected error occured. Please try again later.");
        }
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response: { data: { faculties: FacultyType[] } } =
          await axios.get(`${baseUrl}/faculties/all`);
        if (response?.data?.faculties) {
          setFaculties(
            response.data.faculties.map((faculty) => ({
              key: faculty.id,
              label: `${faculty.first_name} ${faculty.last_name}`,
            })),
          );
        }
      } catch (err) {
        if (isAxiosError(err)) {
          toast.error(
            err?.response?.data?.message ||
              "Error occured while fetching faculties records",
          );
        } else {
          toast.error("Unexpected error occured. Please try again later.");
        }
      }
    };
    fetchFaculties();
  }, []);

  const handleAddClassroomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setClassroom((prev) => ({
      ...prev,
      schedule_time: String(classroom.schedule_time),
    }));

    // API call to store class details in database
    try {
      const toastID = toast.loading("Adding new classroom. Please wait.");
      const response = await axios.post(`${baseUrl}/classes/add`, {
        classroom: classroom,
      });
      toast.dismiss(toastID);
      toast.success(
        response?.data?.message || "New classroom added successfully",
      );
      setTimeout(() => {
        window.location.reload();
      }, 3 * 1000);
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(
          err?.response?.data?.message || "Error adding new classroom",
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
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleAddClassroomSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                Add a new classroom
              </ModalHeader>
              <ModalBody>
                <Toaster richColors position="bottom-center" />
                <div className="grid grid-cols-6 gap-4 ">
                  <Input
                    isRequired
                    required
                    className="col-span-2"
                    type="text"
                    maxLength={50}
                    autoComplete="room_number"
                    label="Room Number"
                    labelPlacement="inside"
                    value={classroom.room_number}
                    onChange={(e) =>
                      setClassroom((prev: ClassType) => {
                        return { ...prev, room_number: e.target.value };
                      })
                    }
                  />
                  <Select
                    isRequired
                    required
                    label="Faculty"
                    className="max-w-full col-span-4"
                    defaultSelectedKeys={[classroom.faculty_id]}
                    onChange={(e) =>
                      setClassroom((prev: ClassType) => {
                        return { ...prev, faculty_id: e.target.value };
                      })
                    }
                  >
                    {faculties.map((faculty) => (
                      <SelectItem key={faculty.key}>{faculty.label}</SelectItem>
                    ))}
                  </Select>
                  <Input
                    isRequired
                    required
                    className="col-span-2"
                    type="time"
                    maxLength={50}
                    autoComplete="schedule_time"
                    label="Schedule Time"
                    labelPlacement="inside"
                    defaultValue={classroom.schedule_time}
                    onChange={(e) =>
                      setClassroom((prev: ClassType) => {
                        return { ...prev, schedule_time: e.target.value };
                      })
                    }
                  />
                  <Select
                    isRequired
                    required
                    label="Course"
                    className="max-w-full col-span-4"
                    defaultSelectedKeys={[classroom.course_id]}
                    onChange={(e) =>
                      setClassroom((prev: ClassType) => {
                        return { ...prev, course_id: e.target.value };
                      })
                    }
                  >
                    {courses.map((course) => (
                      <SelectItem key={course.key}>{course.label}</SelectItem>
                    ))}
                  </Select>
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
