// main.jsx (YENİ KOD)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext' // <-- 1. Import et
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* <-- 2. En dışa AuthProvider'ı ekle */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider> {/* <-- 3. Kapat */}
  </StrictMode>,
)