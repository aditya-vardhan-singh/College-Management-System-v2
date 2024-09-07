import { useEffect } from "react";
import { ClassTable } from "../components/AllComponents";

export default function Class({
  setCurrentPage,
}: {
  setCurrentPage: Function;
}) {
  useEffect(() => {
    setCurrentPage("Class");
  });
  return (
    <>
      <ClassTable />
    </>
  );
}
