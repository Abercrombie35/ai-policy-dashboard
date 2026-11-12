import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DraftsProvider } from './lib/drafts';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DraftsProvider>
      <App />
    </DraftsProvider>
  </React.StrictMode>,
);
