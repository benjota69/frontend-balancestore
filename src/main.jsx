// Aquí se define que al ingresar a la página redireccione a "App"

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root =createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
