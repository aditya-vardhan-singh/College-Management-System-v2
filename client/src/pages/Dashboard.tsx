import { useEffect } from "react";
import { Card1 } from "../components/AllComponents.tsx";
import exams from "../assets/Exams.svg";
import student from "../assets/Student.svg";
import marks from "../assets/Marks.jpg";

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
        <Card1
          img={exams}
          pContent="Configure exams"
          btnContent="Explore"
          href="/exam"
        />
        <Card1
          img={student}
          pContent="Admit students"
          btnContent="Explore"
          href="/student"
        />
        <Card1
          img={marks}
          pContent="Upload marks"
          btnContent="Explore"
          href="#"
        />
      </div>
    </div>
  );
}
// "https://nextui.org/images/hero-card.jpeg"
