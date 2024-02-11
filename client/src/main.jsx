import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { SocketProvider } from './providers/Sockets';
import { PeerProvider } from './providers/Peer.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <PeerProvider>
          <App />
        </PeerProvider>
      </SocketProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
