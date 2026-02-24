import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { LoanProvider } from './context/LoanContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <LoanProvider>
        <App />
      </LoanProvider>
    </AuthProvider>
  </React.StrictMode>,
)