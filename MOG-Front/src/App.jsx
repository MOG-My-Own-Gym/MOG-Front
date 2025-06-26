import { useContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import '@/assets/bootstrap/css/bootstrap.min.css';
import Home from './pages/Home/Home';
import GNB from './components/GNB/GNB';
import ToastContext from './context/ToastContext';
import ToastProvider from './context/ToastProvider';
import Toast from './components/Toast/Toast';
import Stats from './pages/Stats/Stats';
import RecordPage from "./pages/RecordPage";


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
        <Route path="/stats" element={<Stats />}></Route>
        <Route path="/record" element={<RecordPage />} /> 

      </Routes>
    </div>
  );
}

export default App;
