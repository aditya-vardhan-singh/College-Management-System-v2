import { Routes, Route } from "react-router-dom";
import {
  Dashboard,
  Student,
  Faculty,
  Class,
  Exam,
  Course,
} from "./pages/AllPages.tsx";
import { NavigationBar, Footer } from "./components/AllComponents.tsx";
import { useState } from "react";

export default function App() {
  const [currentPage, setCurrentPage] = useState("");
  return (
    <>
      <div className="bg-default-100 min-h-[100vh] flex flex-col justify-between">
        <div>
          <NavigationBar currentPage={currentPage} />
          <div className="mx-5 my-8">
            <Routes>
              <Route
                path="/"
                element={<Dashboard setCurrentPage={setCurrentPage} />}
              />
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
              <Route
                path="/exam"
                element={<Exam setCurrentPage={setCurrentPage} />}
              />
              <Route
                path="/course"
                element={<Course setCurrentPage={setCurrentPage} />}
              />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
