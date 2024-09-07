import { useEffect } from "react";
import { StudentTable } from "../components/AllComponents";

export default function Student({
  setCurrentPage,
}: {
  setCurrentPage: Function;
}) {
  useEffect(() => {
    setCurrentPage("Student");
  });
  return (
    <>
      <StudentTable />
    </>
  );
}
