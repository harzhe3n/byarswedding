import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import InvitationApp from './InvitationApp'
import './styles/fonts.css'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InvitationApp />
  </StrictMode>,
)
