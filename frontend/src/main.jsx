import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./contextapi/store.js";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
<Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
    <App />
  </PersistGate>
</Provider>
  </StrictMode>,
)


