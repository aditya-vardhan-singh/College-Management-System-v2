import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Radio,
  RadioGroup,
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
  department_id,
  course_id,
  sendStudentListToParent,
}: {
  department_id: string;
  course_id: string;
  sendStudentListToParent: (selectedStudents: string[]) => void;
}) {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["2"]));
  const [studentList, setStudentList] = useState<StudentListType[]>([
    {
      id: "1",
      name: "Tony Reichert",
      date_of_birth: "CEO",
    },
    {
      id: "2",
      name: "Tony Reichert",
      date_of_birth: "CEO",
    },
    {
      id: "3",
      name: "Tony Reichert",
      date_of_birth: "CEO",
    },
    {
      id: "4",
      name: "Tony Reichert",
      date_of_birth: "CEO",
    },
  ]);

  const fetchStudentsList = () => {
    try {
      const response = axios.get(`${baseUrl}/students/get-list`, {
        params: { course_id: course_id },
      });
      if (response?.data?.student_list) {
        setStudentList(response?.data?.student_list);
      } else {
        toast.error("Invalid response paramaters");
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

  useEffect(() => {
    fetchStudentsList();
  }, []);

  useEffect(() => {
    sendStudentListToParent([...selectedKeys]);
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
