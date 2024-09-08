import { useEffect } from "react";
import { AttendanceTable } from "../components/AllComponents";

export default function Attendance({
  setCurrentPage,
}: {
  setCurrentPage: Function;
}) {
  useEffect(() => {
    setCurrentPage("Attendance");
  });
  return (
    <>
      <AttendanceTable />
    </>
  );
}
