import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { DAppProvider } from "@usedapp/core";
import dappConfig from "./dappConfig";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DAppProvider config={dappConfig}>
      <App />
    </DAppProvider>
  </React.StrictMode>
);