import { useState } from "react";
import { NavigationBar, Footer } from "./components/AllComponents.tsx";
import Router from "./pages/Router.tsx";

export default function App() {
  const [currentPage, setCurrentPage] = useState("");
  return (
    <div className="bg-default-100 min-h-[100vh] flex flex-col justify-between">
      <div>
        <NavigationBar currentPage={currentPage} />
        <div className="mx-5 my-8">
          <Router setCurrentPage={setCurrentPage} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
