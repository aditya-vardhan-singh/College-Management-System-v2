import { useEffect } from "react";
import { FacultyTable } from "../components/AllComponents.tsx";

export default function Faculty({
  setCurrentPage,
}: {
  setCurrentPage: Function;
}) {
  useEffect(() => {
    setCurrentPage("Faculty");
  });
  return (
    <>
      <FacultyTable />
    </>
  );
}
