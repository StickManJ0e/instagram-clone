import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthContextProvider } from './context/AuthContext';
import { DarkLightProvider } from './context/DarkLightContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <DarkLightProvider>
        <App />
      </DarkLightProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

reportWebVitals();
