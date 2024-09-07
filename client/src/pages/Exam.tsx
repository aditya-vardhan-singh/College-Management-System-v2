import { useEffect } from "react";
import { ExamTable } from "../components/AllComponents";

export default function Class({
  setCurrentPage,
}: {
  setCurrentPage: Function;
}) {
  useEffect(() => {
    setCurrentPage("Exam");
  });
  return (
    <>
      <ExamTable />
    </>
  );
}
