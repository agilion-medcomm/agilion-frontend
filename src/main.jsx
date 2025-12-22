// src/main.jsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PersonnelAuthProvider } from './context/PersonnelAuthContext'
import './index.css'
import './styles/DarkMode.css'
import App from './App.jsx'
import './i18n'

// Suppress browser extension message port warnings
window.addEventListener('error', (event) => {
  if (event.message && event.message.includes('message port closed')) {
    event.preventDefault();
  }
}, true);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PersonnelAuthProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </PersonnelAuthProvider>
  </StrictMode>,
)