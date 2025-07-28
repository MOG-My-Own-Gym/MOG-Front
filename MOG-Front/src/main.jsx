import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import ToastProvider from './context/ToastProvider.jsx';
import ModalAlertProvider from './context/ModalAlertProvider.jsx';
import ModalAlert from './components/Modal/ModalAlert.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ToastProvider>
      <ModalAlertProvider>
        <App />
        <ModalAlert/>
      </ModalAlertProvider>
    </ToastProvider>
  </BrowserRouter>,
);
