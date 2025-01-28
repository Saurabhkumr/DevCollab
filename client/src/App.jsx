import { useState } from "react";
import Home from "./components/Home";
import { Routes, Route } from "react-router-dom";
import EditorPage from "./components/EditorPage";
import { Toaster } from "react-hot-toast";
import "./index.css";

function App() {
  return (
    <>
      <Toaster position="top-center"></Toaster>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:roomId" element={<EditorPage />} />
      </Routes>
    </>
  );
}

export default App;
