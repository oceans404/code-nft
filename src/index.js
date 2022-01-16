import React from 'react';
import ReactDOM from 'react-dom';
import { MoralisProvider } from 'react-moralis';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider
      appId='XEPUj0AtYq3JeMsjZoaoQWPj97mpvyXuCPjK8Ph0'
      serverUrl='https://b1tjgodab2js.usemoralis.com:2053/server'
    >
      <App />
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
