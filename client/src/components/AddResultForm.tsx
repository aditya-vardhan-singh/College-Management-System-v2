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
import { ResultType, NullFunction, CourseType, Key } from "../TypeHints";
import { getLocalTimeZone, today } from "@internationalized/date";

interface ExamFormProps {
  isOpen: NullFunction;
  onClose: NullFunction;
  onOpenChange: NullFunction;
}

export default function AddResultForm({
  isOpen,
  onClose,
  onOpenChange,
}: ExamFormProps) {
  const [result, setResult] = useState<ResultType>({
    id: "",
    student_id: "",
    student_first_name: "",
    student_last_name: "",
    exam_id: "",
    exam_date: "",
    course_id: "",
    course_name: "",
    marks_obtained: "",
  });

  const handleAddExamSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // API call to store result to database
    try {
      const response = await axios.post(`${baseUrl}/results/add`, {
        result: result,
      });
      toast.success(
        response?.data?.message || "New result added successfully.",
      );
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(err?.response?.data?.message || "Error adding new result");
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
                New Result
              </ModalHeader>
              <ModalBody>
                <Toaster richColors position="bottom-center" />
                <div className="grid grid-cols-6 gap-4">
                  <Input
                    isRequired
                    required
                    className="col-span-2"
                    type="number"
                    maxLength={50}
                    autoComplete="student_id"
                    label="Student ID"
                    labelPlacement="inside"
                    value={result.student_id}
                    onChange={(e) =>
                      setResult((prev: ResultType) => {
                        return { ...prev, student_id: e.target.value };
                      })
                    }
                  />
                  <Input
                    isRequired
                    required
                    className="col-span-2"
                    type="number"
                    maxLength={50}
                    autoComplete="exam_id"
                    label="Exam ID"
                    labelPlacement="inside"
                    defaultValue={result.exam_id}
                    onChange={(e) =>
                      setResult((prev: ResultType) => {
                        return { ...prev, exam_id: e.target.value };
                      })
                    }
                  />
                  <Input
                    isRequired
                    required
                    className="col-span-2"
                    type="number"
                    maxLength={50}
                    autoComplete="marks_obtained"
                    label="Marks Obtained"
                    labelPlacement="inside"
                    defaultValue={result.marks_obtained}
                    onChange={(e) =>
                      setResult((prev: ResultType) => {
                        return { ...prev, marks_obtained: e.target.value };
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
