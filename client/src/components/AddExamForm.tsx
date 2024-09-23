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
  DatePicker,
  DateValue,
} from "@nextui-org/react";
import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { baseUrl } from "../data/utils";
import { ExamType, NullFunction, CourseType, Key } from "../TypeHints";
import { getLocalTimeZone, today } from "@internationalized/date";

interface ExamFormProps {
  isOpen: NullFunction;
  onClose: NullFunction;
  onOpenChange: NullFunction;
}

export default function AddExamForm({
  isOpen,
  onClose,
  onOpenChange,
}: ExamFormProps) {
  // Exam details from form
  const [examDate, setExamDate] = useState<DateValue>(
    today(getLocalTimeZone()),
  );
  const [exam, setExam] = useState<ExamType>({
    id: "",
    course: "",
    course_id: "",
    exam_date: "",
    exam_type: "",
    max_marks: "",
  });

  // Course list
  const [courses, setCourses] = useState<Key[]>([
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
          const coursesList = response.data.users.map((course) => ({
            key: course.id,
            label: course.course_name,
          }));
          setCourses(coursesList);
        } else {
          toast.error("Invalid response parameters");
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
    fetchCourses();
  }, []);

  const handleAddExamSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Select course name from course id
    const course = courses.find((course) => {
      return course.key == exam.course_id;
    });

    // Convert date to string (temporarily)
    const exam_date = `${examDate.year}-${examDate.month.toString().padStart(2, "0")}-${examDate.day.toString().padStart(2, "0")}`;

    const updatedExam: ExamType = {
      ...exam,
      course: course?.label,
      exam_date: exam_date,
    };

    // API call to store exam to database
    try {
      const response = await axios.post(`${baseUrl}/exams/add`, {
        exam: updatedExam,
      });
      console.log(updatedExam);
      toast.success(response?.data?.message || "New exam added successfully.");
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(err?.response?.data?.message || "Error adding new exam");
      } else {
        toast.error("An unexpected error occured. Please try later.");
      }
    }

    // Close modal
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
            <form onSubmit={handleAddExamSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                New Exam
              </ModalHeader>
              <ModalBody>
                <Toaster richColors position="bottom-center" />
                <div className="grid grid-cols-6 gap-4">
                  <p className="col-span-6 text-base">Personal details:</p>
                  <Input
                    isRequired
                    required
                    className="col-span-2"
                    type="text"
                    maxLength={50}
                    autoComplete="exam_type"
                    label="Exam Type"
                    labelPlacement="inside"
                    value={exam.exam_type}
                    onChange={(e) =>
                      setExam((prev: ExamType) => {
                        return { ...prev, exam_type: e.target.value };
                      })
                    }
                  />
                  <Input
                    isRequired
                    required
                    className="col-span-2"
                    type="number"
                    maxLength={50}
                    autoComplete="max_marks"
                    label="Max Marks"
                    labelPlacement="inside"
                    defaultValue={exam.max_marks}
                    onChange={(e) =>
                      setExam((prev: ExamType) => {
                        return { ...prev, max_marks: e.target.value };
                      })
                    }
                  />
                  <Select
                    isRequired
                    required
                    label="Course"
                    className="max-w-xs col-span-2"
                    defaultSelectedKeys={exam.course_id ? [exam.course_id] : []}
                    onChange={(e) =>
                      setExam((prev: ExamType) => {
                        return { ...prev, course_id: e.target.value };
                      })
                    }
                  >
                    {courses.map((course) => (
                      <SelectItem key={course.key} textValue={course.label}>
                        {course.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <DatePicker
                    label="Exam Date"
                    className="max-w-full col-span-2"
                    minValue={today(getLocalTimeZone())}
                    maxValue={today(getLocalTimeZone()).add({ years: 2 })}
                    showMonthAndYearPickers
                    value={examDate}
                    onChange={setExamDate}
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
