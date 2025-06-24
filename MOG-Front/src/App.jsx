import { useContext, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import '@/assets/bootstrap/css/bootstrap.min.css';
import Home from './pages/Home/Home';
import GNB from './components/GNB/GNB';
import ToastContext from './context/ToastContext';
import ToastProvider from './context/ToastProvider';
import Toast from './components/Toast/Toast';

function App() {
  console.log(ToastContext);
  const toastContext = useContext(ToastContext);
  
  return (
    <div>
      <ToastProvider>
        <GNB />
        <Toast />
        <Routes>
          <Route path="/" element={<Home />}></Route>
        </Routes>
      </ToastProvider>
    </div>
  );
}

export default App;
