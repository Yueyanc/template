import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createClient } from 'electron-bridge-ipc/electron-sandbox'
import App from './App.tsx'
import './index.css'

await createClient()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
