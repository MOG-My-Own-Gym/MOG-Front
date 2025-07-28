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
import Routine from './pages/Routine/Routine';
import PoseCheck from './pages/PoseCheck/PoseCheck';
import ChangePwPage from './pages/FindPw/ChangePwPage';
import ModalAlertProvider from './context/ModalAlertProvider';
import ModalAlert from './components/Modal/ModalAlert';
import DataToss from './pages/mainpage/DataToss';
import SelectExercises from './pages/Routine/SelectExercises/SelectExercises';
import { RoutineProvider } from './pages/Routine/RoutineContext';
import RoutineDetail from './pages/Routine/RoutineDetail/RoutineDetail';
import './App.css';
import RoutineRun from './pages/Routine/RoutineRun/RoutineRun';
import { RunProvider } from './pages/Routine/RunContext';

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
        <RoutineProvider>
          <RunProvider>
            <GNB />
            <Toast isToast={toast.isToast} content={toast.content} />
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/stats" element={<Stats />}></Route>
              <Route path="/record" element={<RecordPage />} />
              <Route path="/social" element={<Social />} />
              <Route path="/post/:id" element={<SocialDetail />} />
              <Route path="/mypage/*" element={<MyPage />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/find-id" element={<FindIdPage />} />
              <Route path="/find-pw" element={<FindPwPage />} />
              <Route path="/find-pw/change" element={<ChangePwPage />} />
              <Route path="/pose" element={<PoseCheck />} />
              {/* 루틴 실행 */}
              <Route path="/routine" element={<Routine />} />
              <Route path="/routine/select" element={<SelectExercises />} />
              <Route path="/routine/detail" element={<RoutineDetail />} />
              <Route path="/routine/run" element={<RoutineRun />} />
            </Routes>
          </RunProvider>
        </RoutineProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
