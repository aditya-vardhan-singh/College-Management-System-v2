import { Routes, Route } from "react-router-dom";
import {
  Dashboard,
  Student,
  Faculty,
  Class,
  Exam,
  Course,
  Result,
  Attendance,
  Department,
} from "./AllPages.tsx";

export default function Router({
  setCurrentPage,
}: {
  setCurrentPage: Function;
}) {
  return (
    <Routes>
      <Route path="/" element={<Dashboard setCurrentPage={setCurrentPage} />} />
      <Route
        path="/student"
        element={<Student setCurrentPage={setCurrentPage} />}
      />
      <Route
        path="/faculty"
        element={<Faculty setCurrentPage={setCurrentPage} />}
      />
      <Route
        path="/class"
        element={<Class setCurrentPage={setCurrentPage} />}
      />
      <Route path="/exam" element={<Exam setCurrentPage={setCurrentPage} />} />
      <Route
        path="/course"
        element={<Course setCurrentPage={setCurrentPage} />}
      />
      <Route
        path="/result"
        element={<Result setCurrentPage={setCurrentPage} />}
      />
      <Route
        path="/attendance"
        element={<Attendance setCurrentPage={setCurrentPage} />}
      />
      <Route
        path="/department"
        element={<Department setCurrentPage={setCurrentPage} />}
      />
    </Routes>
  );
}
