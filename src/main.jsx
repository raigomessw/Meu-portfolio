import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WorkProjectProvider } from './components/Work/WorkProjectContext';
import './components/styles/index.css';
import './components/styles/responsive.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WorkProjectProvider>
      <App />
    </WorkProjectProvider>
  </React.StrictMode>
);