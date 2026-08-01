import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {FirebaseProvider} from './context Api/Firebase.jsx'
import { ScrollToTop } from './lib/utils.js'

// scrollToTop is a utility component and hence it can't be used to wrap other components, rather it's 
// just used for running side-effects

createRoot(document.getElementById('root')).render(
    <FirebaseProvider>
      <BrowserRouter>
        <ScrollToTop /> 
          <App />
      </BrowserRouter>
    </FirebaseProvider>
)
