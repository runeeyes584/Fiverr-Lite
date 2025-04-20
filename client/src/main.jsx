// Lê Anh Tiến bị ngu
import { ClerkProvider } from '@clerk/clerk-react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const Clerk_Key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!Clerk_Key) {
  throw new Error('VITE_CLERK_PUBLISHABLE_KEY is not defined')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={Clerk_Key}>     
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
