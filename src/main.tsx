import React from 'react'

import ReactDOM from 'react-dom/client'

import App from './App'

import ErrorBoundary from './components/ErrorBoundary'

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

try {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (error) {
  console.error('Error rendering app:', error);
  document.body.innerHTML = `
    <div style="color: red; padding: 20px;">
      <h1>Error Loading App</h1>
      <pre>${error instanceof Error ? error.message : 'Unknown error'}</pre>
    </div>
  `;
} 
