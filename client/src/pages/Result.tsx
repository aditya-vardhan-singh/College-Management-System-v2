import { useEffect } from "react";
import { ResultTable } from "../components/AllComponents";

export default function Result({
  setCurrentPage,
}: {
  setCurrentPage: Function;
}) {
  useEffect(() => {
    setCurrentPage("Result");
  });
  return (
    <>
      <ResultTable />
    </>
  );
}
