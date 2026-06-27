import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import "./index.css"
import App from "./App.tsx"
import YesPage from "./pages/YesPage.tsx"
import FoodPage from "./pages/FoodPage.tsx"
import ConfirmationPage from "./pages/ConfirmationPage.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/yes" element={<YesPage />} />
          <Route path="/food" element={<FoodPage />} />
          <Route path="/confirmed" element={<ConfirmationPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)

