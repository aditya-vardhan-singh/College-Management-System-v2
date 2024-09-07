import { useEffect } from "react";
import { CourseTable } from "../components/AllComponents";

export default function Course({
  setCurrentPage,
}: {
  setCurrentPage: Function;
}) {
  useEffect(() => {
    setCurrentPage("Course");
  });
  return (
    <>
      <CourseTable />
    </>
  );
}
