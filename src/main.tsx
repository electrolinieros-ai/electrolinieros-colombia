import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider } from "@tanstack/react-router";

import { CssBaseline, ThemeProvider } from "@mui/material";

import { createAppRouter } from "./lib/router";
import { touchVisitor } from "./lib/visitor";
import theme from "./theme/theme";

import "./index.css";

const router = createAppRouter();

void touchVisitor();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No se encontró el elemento #root");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
