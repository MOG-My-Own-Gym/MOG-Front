import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import '@/assets/bootstrap/css/bootstrap.min.css';
import Home from './pages/Home/Home';
import GNB from './components/GNB/GNB';
import ToastContext from './context/ToastContext';
import ToastProvider from './context/ToastProvider';
import Toast from './components/Toast/Toast';
import Stats from './pages/Stats/Stats';
import RecordPage from './pages/RecordPage';

import Social from './pages/Social/Social';

function App() {
  return (
    
    <div>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/stats" element={<Stats />}></Route>
        <Route path="/record" element={<RecordPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/social" element={<Social />} />
      </Routes>

    </div>
  );
}

export default App;
