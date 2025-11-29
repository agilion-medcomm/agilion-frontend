// src/main.jsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
<<<<<<< HEAD
import { PersonnelAuthProvider } from './context/PersonnelAuthContext' 
=======
<<<<<<< HEAD
import { PersonnelAuthProvider } from './context/PersonnelAuthContext' 
=======
import { StaffAuthProvider } from './context/StaffAuthContext' // <-- BU SATIR ÖNEMLİ
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
<<<<<<< HEAD
    <PersonnelAuthProvider> 
=======
<<<<<<< HEAD
    <PersonnelAuthProvider> 
=======
    <StaffAuthProvider> 
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a
        <AuthProvider> 
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthProvider>
<<<<<<< HEAD
    </PersonnelAuthProvider>
=======
<<<<<<< HEAD
    </PersonnelAuthProvider>
=======
    </StaffAuthProvider>
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a
  </StrictMode>,
)