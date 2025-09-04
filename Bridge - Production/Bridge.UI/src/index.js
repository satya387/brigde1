import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './auth/authConfig';
import { MsalProvider } from '@azure/msal-react';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter

const msalInstance = new PublicClientApplication(msalConfig);
const root = ReactDOM.createRoot(
  document.getElementById('root')
);
root.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <Router> {/* Wrap your App component with BrowserRouter */}
        <App />
      </Router>
    </MsalProvider>
  </React.StrictMode>
);
