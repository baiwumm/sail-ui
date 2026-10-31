import {I18nProvider} from "@heroui/react";
import {StrictMode} from "react";
import {createRoot} from "react-dom/client";

import App from "./App";
import "./style.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider locale="en-US">
      <App />
    </I18nProvider>
  </StrictMode>,
);
