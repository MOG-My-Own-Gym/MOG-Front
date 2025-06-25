import { useContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import '@/assets/bootstrap/css/bootstrap.min.css';
import Home from './pages/Home/Home';
import GNB from './components/GNB/GNB';
import ToastContext from './context/ToastContext';
import ToastProvider from './context/ToastProvider';
import Toast from './components/Toast/Toast';

function App() {
  const { toast, dispatch } = useContext(ToastContext);
  useEffect(() => {
    if (toast.isToast) {
      setTimeout(() => {
        dispatch('HIDE_TOAST');
      }, 2000);
    }
  }, [toast]);
  return (
    <div>
      <GNB />
      <Toast isToast={toast.isToast} content={toast.content} />
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </div>
  );
}

export default App;
