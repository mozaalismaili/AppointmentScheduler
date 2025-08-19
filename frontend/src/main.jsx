 w2-validation-ux
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
    ReactDOM.createRoot(document.getElementById("root")).render(
        <Provider store={store}>
            <QueryClientProvider client={qc}>
                <App />
            </QueryClientProvider>
        </Provider>
    );
});

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
 main
