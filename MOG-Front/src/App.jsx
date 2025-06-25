import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import '@/assets/bootstrap/css/bootstrap.min.css';
import Home from './pages/Home/Home';
import GNB from './components/GNB/GNB';
import Stats from './pages/Stats/Stats';

function App() {
  return (
    <div>
      <GNB />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/stats" element={<Stats />}></Route>
      </Routes>
    </div>
  );
}

export default App;
