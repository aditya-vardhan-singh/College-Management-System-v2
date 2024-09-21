import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Selection,
} from "@nextui-org/react";
import axios, { isAxiosError } from "axios";
import { Toaster, toast } from "sonner";
import { StudentListType } from "../TypeHints";
import { baseUrl } from "../data/utils";

const columns = [
  {
    key: "id",
    label: "STUDENT ID",
  },
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "date_of_birth",
    label: "DATE OF BIRTH",
  },
];

export default function AttendanceList({
  course_id,
  sendStudentListToParent,
}: {
  course_id: string;
  sendStudentListToParent: (selectedStudents: string[]) => void;
}) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [studentList, setStudentList] = useState<StudentListType[]>([
    {
      id: "",
      name: "",
      date_of_birth: "",
    },
  ]);

  useEffect(() => {
    const fetchStudentsList = async () => {
      try {
        const response: {
          data: {
            student_list: { id: string; name: string; date_of_birth: string }[];
          };
        } = await axios.get(`${baseUrl}/enrollments/student-by-course`, {
          params: { course_id: course_id },
        });
        console.log(response);
        if (response?.data?.student_list) {
          setStudentList(response?.data?.student_list);
        } else {
          toast.error("Invalid received paramaters");
        }
      } catch (err) {
        if (isAxiosError(err)) {
          toast.error(
            err?.response?.data?.message ||
              "Error occured fetching student records!",
          );
        } else {
          toast.error("Unexpected error occured while getting student records");
        }
      }
    };

    fetchStudentsList();
  }, [course_id]);

  useEffect(() => {
    sendStudentListToParent([...selectedKeys] as string[]);
  }, [selectedKeys, sendStudentListToParent]);

  return (
    <div className="flex flex-col gap-3">
      <Toaster richColors position="bottom-center" />
      <Table
        aria-label="Selection behavior table example with dynamic content"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={studentList}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
