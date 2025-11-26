// src/main.jsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PersonnelAuthProvider } from './context/PersonnelAuthContext' 
import './index.css'
import App from './App.jsx'

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