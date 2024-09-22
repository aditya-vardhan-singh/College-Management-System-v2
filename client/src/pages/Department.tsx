import { useEffect } from "react";
import { DepartmentTable } from "../components/AllComponents";

export default function Department({
  setCurrentPage,
}: {
  setCurrentPage: Function;
}) {
  useEffect(() => {
    setCurrentPage("Department");
  });
  return (
    <>
      <DepartmentTable />
    </>
  );
}
