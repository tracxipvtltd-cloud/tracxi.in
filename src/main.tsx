/**
 * Tracxi Application Entry Point
 * Initializes React and mounts the App component
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Create root and render
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Handle hot module replacement
if (import.meta.hot) {
  import.meta.hot.accept('./App', () => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  });
}