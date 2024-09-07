import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NextUIProvider>
      <main className="dark text-foreground bg-background">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </main>
    </NextUIProvider>
  </StrictMode>,
);
