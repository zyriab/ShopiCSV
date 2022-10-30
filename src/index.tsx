import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './auth/AuthProvider';
import { BrowserRouter } from 'react-router-dom';
import './utils/translations/translations.ts';

import './index.css';
import './style.css';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
