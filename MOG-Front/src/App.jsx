import { useContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import '@/assets/bootstrap/css/bootstrap.min.css';
import Home from './pages/Home/Home';
import GNB from './components/GNB/GNB';
import SelectMainpage from './components/mainpage/SelectMainpage';
import CategoryPage from './components/mainpage/CategoryPage';
import RoutinePage from './components/mainpage/RoutinePage';
import RunningRoutinePage from './components/mainpage/RunningRoutinePage';
import RoutineResultPage from './components/mainpage/RoutineResultPage';

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
        <Route path="/home" element={<SelectMainpage />}></Route>
        <Route path="/select" element={<CategoryPage />}></Route>
        <Route path="/routine" element={<RoutinePage />}></Route>
        <Route path="/runningroutine" element={<RunningRoutinePage />}></Route>
        <Route path="/routineresult" element={<RoutineResultPage />}></Route>
        <Route path="/stats" element={<Stats />}></Route>
      </Routes>
    </div>
  );
}

export default App;
