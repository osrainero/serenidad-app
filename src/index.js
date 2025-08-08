// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Si quieres que tu app funcione offline y cargue más rápido, cambia
// serviceWorkerRegistration.register() a serviceWorkerRegistration.register()
serviceWorkerRegistration.register();