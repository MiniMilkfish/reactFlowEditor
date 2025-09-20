import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// reactflow-color-chooser (by zustand)
import ReactflowColorChooserApp from "./Reactflow-ColorChooser-App/App.tsx";

// reactflow-overview (by zustand)
import ReactflowOverviewApp from "./ReactflowOverviewApp/App.tsx";

// reactflow-overview (without zustand) // 对照组
import ReactflowOverviewWithoutZustandApp from "./ReactflowOverviewApp_WithoutZustand/App.tsx";

// zundo 官方示例
import ZundoOfficeDemoApp from "./ZundoOfficeDemoApp/App.tsx";

const App = ZundoOfficeDemoApp;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
