import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import { store } from "./app/store";
import "./index.css";

const qc = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={qc}>
        <BrowserRouter>
          <div id="app-shell">
            <main className="app-main">
              <App />
            </main>
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
