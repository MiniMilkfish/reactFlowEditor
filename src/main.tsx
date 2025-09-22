// Language: TypeScript JSX
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@ant-design/v5-patch-for-react-19";

// reactflow-color-chooser (by zustand)
import ReactflowColorChooserApp from "./Reactflow-ColorChooser-App/App.tsx";

// reactflow-overview (by zustand)
import ReactflowOverviewApp from "./ReactflowOverviewApp/App.tsx";

// reactflow-overview (without zustand) // 对照组
import ReactflowOverviewWithoutZustandApp from "./ReactflowOverviewApp_WithoutZustand/App.tsx";

// zundo 官方示例
import ZundoOfficeDemoApp from "./ZundoOfficeDemoApp/App.tsx";

// reactflow-undo-redo
import ReactflowUndoRedoApp from "./ReactflowUndoRedoApp/App.tsx";

// reactflow-undo-redo with states pannel
import ReactflowUndoRedoWithStatesPannelApp from "./ReactflowUndoRedoWithStatesPannelApp/App.tsx";

const App = ReactflowUndoRedoWithStatesPannelApp;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
