// src/main.jsx
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import "./index.css";

const qc = new QueryClient();

async function prepare() {
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser");
    await worker.start({ serviceWorker: { url: "/mockServiceWorker.js" } });
    console.log("MSW mocking enabled");
  }
}

prepare().then(() => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <Provider store={store}>
        <QueryClientProvider client={qc}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </StrictMode>
  );
});
