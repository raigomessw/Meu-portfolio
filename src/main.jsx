import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WorkProjectProvider } from './components/Work/WorkProjectContext';
import './components/styles/index.css';
import './components/styles/base.css';
import './components/styles/typography.css';
import './components/styles/variables.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WorkProjectProvider>
      <App />
    </WorkProjectProvider>
  </React.StrictMode>
);