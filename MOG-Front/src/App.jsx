import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import '@/assets/bootstrap/css/bootstrap.min.css';
import Home from './pages/Home/Home';
import Social from './pages/Social/Social';

function App() {
  return (
    
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/social" element={<Social />} />
      </Routes>

    </div>
  );
}

export default App;
