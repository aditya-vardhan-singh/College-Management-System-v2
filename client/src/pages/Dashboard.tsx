import { useEffect } from "react";
import { Card1 } from "../components/AllComponents.tsx";

export default function Dashboard({
  setCurrentPage,
}: {
  setCurrentPage: Function;
}) {
  useEffect(() => {
    setCurrentPage("Dashboard");
  });
  return (
    <div>
      <div className="flex flex-row gap-8 ">
        <Card1 img="" pContent="Configure exams" btnContent="Set" />
        <Card1 img="" pContent="Admit students" btnContent="Explore" />
        <Card1 img="" pContent="Exams" btnContent="Explore" />
      </div>
    </div>
  );
}
