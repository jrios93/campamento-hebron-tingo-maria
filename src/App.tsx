import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LandingPage } from "./features/landing-form/pages/LandingPage"
import { DashboardPage } from "./features/dashboard/pages/DashboardPage"
import { isEnvironmentValid } from "./lib/env-validation"

function App() {
  // Always apply dark theme
  if (typeof window !== 'undefined') {
    document.documentElement.classList.add('dark')
    
    // Validar entorno en producción
    if (import.meta.env.PROD && !isEnvironmentValid) {
      document.body.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-family: system-ui;
          background: #1a1a1a;
          color: white;
          text-align: center;
          padding: 2rem;
        ">
          <div>
            <h1 style="color: #ef4444; margin-bottom: 1rem;">⚠️ Error de Configuración</h1>
            <p style="margin-bottom: 1rem;">El sitio no está configurado correctamente.</p>
            <p style="font-size: 0.9rem; opacity: 0.8;">Por favor contacta al administrador.</p>
          </div>
        </div>
      `
      return
    }
  }
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App