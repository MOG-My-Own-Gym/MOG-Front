import { useContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import '@/assets/bootstrap/css/bootstrap.min.css';
import Home from './pages/Home/Home';
import GNB from './components/GNB/GNB';
import ToastContext from './context/ToastContext';
import ToastProvider from './context/ToastProvider';
import Toast from './components/Toast/Toast';
import Stats from './pages/Stats/Stats';
import RecordPage from './pages/Record/RecordPage';
import LoginPage from './pages/Login/LoginPage';
import Social from './pages/Social/Social';
import SocialDetail from './pages/Social/SocialDetail';
import MyPage from './pages/Mypage/MyPage';
import { AuthProvider } from './pages/Login/AuthContext';
import SignUp from './pages/SignUp/SignUp';
import FindIdPage from './pages/FindId/FindIdPage';
import FindPwPage from './pages/FindPw/FindPwPage';
import DataToss from './pages/mainpage/DataToss';

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
    <div style={{ padding: '4.5em 0 0 0' }}>
      <AuthProvider>
        <GNB />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/data/*" element={<DataToss />}></Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/stats" element={<Stats />}></Route>
          <Route path="/record" element={<RecordPage />} />
          <Route path="/social" element={<Social />} />
          <Route path="/post/:id" element={<SocialDetail />} />
          <Route path="/mypage/*" element={<MyPage />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/find-id" element={<FindIdPage />} />
          <Route path="/find-pw" element={<FindPwPage />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
