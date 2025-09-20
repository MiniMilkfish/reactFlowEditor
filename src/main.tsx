import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// reactflow-overview
// import ReactflowOverviewApp from "./ReactflowOverviewApp/App.tsx";

// reactflow-color-chooser
import ReactflowColorChooserApp from "./Reactflow-ColorChooser-App/App.tsx";

// default App
// import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactflowColorChooserApp />
  </StrictMode>,
);
