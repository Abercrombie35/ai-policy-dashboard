import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DraftsProvider } from './lib/drafts';
import ErrorBoundary from './components/ErrorBoundary';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <DraftsProvider>
        <App />
      </DraftsProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
