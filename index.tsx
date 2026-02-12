import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Polyfill process.env for browser environments.
// We merge runtime injected variables (window.env from server.js) into process.env
// so that code using process.env.API_KEY works transparently.
const runtimeEnv = (window as any).env || {};
const existingEnv = (window as any).process?.env || {};

(window as any).process = {
  env: {
    ...existingEnv,
    ...runtimeEnv
  }
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);