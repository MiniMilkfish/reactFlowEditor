import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// reactflow overview
import ReactflowOverviewApp from "./ReactflowOverviewApp/App.tsx";

// import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactflowOverviewApp />
  </StrictMode>,
);
