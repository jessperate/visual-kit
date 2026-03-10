import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./app/App.tsx";
import { SnapLanding } from "./app/components/brand-kit/SnapLanding.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/snap" element={<SnapLanding />} />
      <Route path="*" element={<App />} />
    </Routes>
  </BrowserRouter>
);
