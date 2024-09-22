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
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { baseUrl } from "../data/utils";
import { NullFunction } from "../TypeHints";

interface StudentFormProps {
  isOpen: NullFunction;
  onClose: NullFunction;
  onOpenChange: NullFunction;
}

export default function AddDepartmentForm({
  isOpen,
  onClose,
  onOpenChange,
}: StudentFormProps) {
  // Department details from form
  const [department, setDepartment] = useState({
    department_name: "",
  });

  const handleAddDepartmentSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    // API call to store department to database
    try {
      const response = await axios.post(`${baseUrl}/departments/add`, {
        department: department,
      });
      toast.success(
        response?.data?.message || "New department added successfully.",
      );
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(
          err?.response?.data?.message + ": " + err?.response?.data?.error ||
            "Error adding new department",
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
        size="xl"
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleAddDepartmentSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                New Department
              </ModalHeader>
              <ModalBody>
                <Toaster richColors position="bottom-center" />
                <div className="grid grid-cols-6 gap-4">
                  <Input
                    isRequired
                    required
                    className="col-span-6"
                    type="text"
                    maxLength={50}
                    autoComplete="department_name"
                    label="Department Name"
                    labelPlacement="inside"
                    value={department.department_name}
                    onChange={(e) =>
                      setDepartment((prev) => {
                        return { ...prev, department_name: e.target.value };
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
                  Add Department
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
