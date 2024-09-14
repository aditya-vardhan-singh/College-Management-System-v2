import { useEffect } from "react";
import { Card1 } from "../components/AllComponents.tsx";
import exams from "../assets/Exams.svg";
import student from "../assets/male-professorStudent.svg";
// import marks from "../assets/Grades.jpg";
import faculty from "../assets/female-teacherFaculty.svg";
import marks from "../assets/marks.svg";
// import faculty from "../assets/Faculty.svg";

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
          img={student}
          pContent="Manage students"
          btnContent="Explore"
          href="/student"
        />
        <Card1
          img={faculty}
          pContent="Manage faculty"
          btnContent="Explore"
          href="/faculty"
        />
        <Card1
          img={marks}
          pContent="Record Grades"
          btnContent="Explore"
          href="/result"
        />
        <Card1
          img={exams}
          pContent="Configure exams"
          btnContent="Explore"
          href="/exam"
        />
      </div>
    </div>
  );
}
// "https://nextui.org/images/hero-card.jpeg"
