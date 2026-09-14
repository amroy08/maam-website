import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals.js';
import App from './App.jsx';
import { Provider } from 'react-redux';
import Store from './redux/store';

// Get the root element
const rootElement = document.getElementById('root');

// Create React root
const root = createRoot(rootElement);

// Render the application with Redux Provider
root.render(
    <React.StrictMode>
        <Provider store={Store}>
            <App />
        </Provider>
    </React.StrictMode>
);

reportWebVitals();
