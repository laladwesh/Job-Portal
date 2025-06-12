import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Global styles
import { ClerkProvider } from '@clerk/clerk-react'
import { shadesOfPurple } from '@clerk/themes'

// Load the Clerk publishable key from your .env file
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Ensure the Clerk key is set, or throw an error
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

// Bootstrap the React app, wrap everything in ClerkProvider for authentication
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ClerkProvider enables authentication and user management for the app */}
    <ClerkProvider
      appearance={{
        baseTheme: shadesOfPurple, // Set Clerk UI to "Shades of Purple" theme
      }}
      publishableKey={PUBLISHABLE_KEY} // Pass the publishable key
      afterSignOutUrl="/" // After logout, go to landing page
    >
      {/* Main application code */}
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
