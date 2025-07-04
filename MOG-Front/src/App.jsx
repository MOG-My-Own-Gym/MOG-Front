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
import ToastContext from './context/ToastContext';
import ToastProvider from './context/ToastProvider';
import Toast from './components/Toast/Toast';
import Stats from './pages/Stats/Stats';
import RecordPage from './pages/Record/RecordPage';
import LoginPage from './pages/Login/LoginPage';
import Social from './pages/Social/Social';
import MyPage from './pages/Mypage/MyPage';

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
    <div style={{ padding: '5em 0 0 0' }}>
      <GNB />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/home" element={<SelectMainpage />}></Route>
        <Route path="/select" element={<CategoryPage />}></Route>
        <Route path="/routine" element={<RoutinePage />}></Route>
        <Route path="/runningroutine" element={<RunningRoutinePage />}></Route>
        <Route path="/routineresult" element={<RoutineResultPage />}></Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/stats" element={<Stats />}></Route>
        <Route path="/record" element={<RecordPage />} />
        <Route path="/social" element={<Social />} />
        <Route path="/mypage/*" element={<MyPage />} />
      </Routes>
    </div>
  );
}

export default App;
