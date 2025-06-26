import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import '@/assets/bootstrap/css/bootstrap.min.css';
import Home from './pages/Home/Home';
import GNB from './components/GNB/GNB';
<<<<<<< feat/mainpages
=======
import ToastContext from './context/ToastContext';
import ToastProvider from './context/ToastProvider';
import Toast from './components/Toast/Toast';
import Stats from './pages/Stats/Stats';
import RecordPage from './pages/RecordPage';

import Social from './pages/Social/Social';
>>>>>>> develop

function App() {
  return (
    <div>
      <GNB />
      <Routes>
        <Route path="/" element={<Home />}></Route>
<<<<<<< feat/mainpages
=======
        <Route path="/stats" element={<Stats />}></Route>
        <Route path="/record" element={<RecordPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/social" element={<Social />} />
>>>>>>> develop
      </Routes>
    </div>
  );
}

export default App;
