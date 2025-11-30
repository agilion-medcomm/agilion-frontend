// src/main.jsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
<<<<<<< HEAD
import { PersonnelAuthProvider } from './context/PersonnelAuthContext'
import { NotificationProvider } from './context/NotificationContext'
=======
<<<<<<< HEAD
import { PersonnelAuthProvider } from './context/PersonnelAuthContext' 
=======
import { StaffAuthProvider } from './context/StaffAuthContext' // <-- BU SATIR ÖNEMLİ
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
>>>>>>> main
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
<<<<<<< HEAD
    <PersonnelAuthProvider> 
        <NotificationProvider>
            <AuthProvider> 
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </AuthProvider>
        </NotificationProvider>
    </PersonnelAuthProvider>
=======
<<<<<<< HEAD
    <PersonnelAuthProvider> 
=======
    <StaffAuthProvider> 
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
        <AuthProvider> 
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthProvider>
<<<<<<< HEAD
    </PersonnelAuthProvider>
=======
    </StaffAuthProvider>
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
>>>>>>> main
  </StrictMode>,
)