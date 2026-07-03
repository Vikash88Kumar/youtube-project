import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./contextapi/store.js";
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'
import './index.css'

// Register Service Worker
registerSW({ immediate: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
)