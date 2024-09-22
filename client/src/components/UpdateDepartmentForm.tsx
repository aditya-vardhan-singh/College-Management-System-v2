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
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { baseUrl } from "../data/utils";
import { NullFunction } from "../TypeHints";

interface StudentFormProps {
  currentDepartmentDetails: { id: string; department_name: string };
  isOpen: NullFunction;
  onClose: NullFunction;
  onOpenChange: NullFunction;
}

export default function UpdateDepartmentForm({
  currentDepartmentDetails,
  isOpen,
  onClose,
  onOpenChange,
}: StudentFormProps) {
  // Departments details from form
  const [department, setDepartment] = useState({
    id: currentDepartmentDetails.id,
    department_name: currentDepartmentDetails.department_name,
  });

  const handleUpdateDepartmentSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    // API call to store department to database
    try {
      const response = await axios.put(`${baseUrl}/departments/update`, {
        department: department,
      });
      toast.success(
        response?.data?.message || "Department updated successfully.",
      );
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(
          err?.response?.data?.message || "Error updating department",
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
            <form onSubmit={handleUpdateDepartmentSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                Update Department
              </ModalHeader>
              <ModalBody>
                <Toaster richColors position="bottom-center" />
                <div className="grid grid-cols-6 gap-4">
                  <Input
                    name="id"
                    isRequired
                    required
                    type="text"
                    label="Department"
                    labelPlacement="inside"
                    value={department.department_name}
                    onChange={(e) => {
                      setDepartment((prev) => ({
                        ...prev,
                        department_name: e.target.value,
                      }));
                    }}
                    className="col-span-6"
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
