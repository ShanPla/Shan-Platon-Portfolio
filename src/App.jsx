import { Route, Routes } from "react-router-dom";
import Home from "./Home.jsx";
import ProjectDetail from "./ProjectDetail.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
    </Routes>
  );
}