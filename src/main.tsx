import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app-entry";
import "./index.css";

const documentElement = document.getElementById("root");

if (!documentElement) {
  throw new Error("No root element found");
}

ReactDOM.createRoot(documentElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
