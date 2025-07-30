import { useContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import '@/assets/bootstrap/css/bootstrap.min.css';
import Home from './pages/Home/Home';
import GNB from './components/GNB/GNB';
import ToastContext from './context/ToastContext';
import Stats from './pages/Stats/Stats';
import RecordPage from './components/Record/RecordPage';
import LoginPage from './pages/Login/LoginPage';
import Social from './pages/Social/Social';
import SocialDetail from './pages/Social/SocialDetail';
import MyPage from './pages/Mypage/MyPage';
import { AuthProvider } from './pages/Login/AuthContext';
import SignUp from './pages/SignUp/SignUp';
import FindIdPage from './pages/FindId/FindIdPage';
import FindPwPage from './pages/FindPw/FindPwPage';
import Suggest from './pages/Suggest/Suggest';
import Routine from './pages/Routine/Routine';
import PoseCheck from './pages/PoseCheck/PoseCheck';
import ChangePwPage from './pages/FindPw/ChangePwPage';
import DataToss from './pages/mainpage/DataToss';
import SelectMainpage from './pages/mainpage/SelectMainpage';
import CategoryPage from './pages/mainpage/CategoryPage';
import RoutinePage from './pages/mainpage/RoutinePage';
import RunningRoutinePage from './pages/mainpage/RunningRoutinePage';
import RoutineResultPage from './pages/mainpage/RoutineResultPage';


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
