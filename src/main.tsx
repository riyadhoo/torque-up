
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { EnhancedAuthProvider } from "@/lib/securityAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <EnhancedAuthProvider>
            <App />
          </EnhancedAuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
