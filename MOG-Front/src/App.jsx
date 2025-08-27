import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import '@/assets/bootstrap/css/bootstrap.min.css';
import Home from './pages/Home/Home';
import GNB from './components/GNB/GNB';
import Toast from './components/Toast/Toast';
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
import SocialCreate from './pages/Social/SocialCreate';
import SocialEdit from './pages/Social/SocialEdit';
import SuggestProvider from './context/SuggestProvider';
import SelectMainpage from './pages/mainpage/SelectMainpage';
import CategoryPage from './pages/mainpage/CategoryPage';
import RoutinePage from './pages/mainpage/RoutinePage';
import RunningRoutinePage from './pages/mainpage/RunningRoutinePage';
import RoutineResultPage from './pages/mainpage/RoutineResultPage';
import { RoutineProvider } from './pages/Routine/RoutineContext';
import Shop from './pages/Shop/Shop';

import './App.css';
import SelectExercises from './pages/Routine/SelectExercises/SelectExercises';
import RoutineDetail from './pages/Routine/RoutineDetail/RoutineDetail';
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

  const location = useLocation();
  useLayoutEffect(() => {
    if (location.pathname.startsWith('/mypage')) {
      document.documentElement.style.setProperty('overflow-y', 'hidden', 'important');
    } else {
      document.documentElement.style.setProperty('overflow-y', 'auto', 'important');

      console.log(document.body.style.overflow);
    }
  }, [location.pathname]);

  return (
    <div style={{ padding: '4.5em 0 0 0' }}>
      <AuthProvider>
        <RunProvider>
          <RoutineProvider>
            <SuggestProvider>
              <GNB />
              <Toast isToast={toast.isToast} content={toast.content} />
              <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/stats" element={<Stats />}></Route>
                <Route path="/record" element={<RecordPage />} />
                <Route path="/social" element={<Social />} />
                <Route path="/post/:id" element={<SocialDetail />} />
                <Route path="/social/create" element={<SocialCreate />} />
                <Route path="/social/edit/:id" element={<SocialEdit />} />
                <Route path="/mypage/*" element={<MyPage />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/find-id" element={<FindIdPage />} />
                <Route path="/find-pw" element={<FindPwPage />} />
                <Route path="/find-pw/change" element={<ChangePwPage />} />
                <Route path="/pose" element={<PoseCheck />} />
                <Route path="/routine" element={<Routine />}></Route>
                <Route path="/routine/select" element={<SelectExercises />}></Route>
                <Route path="/routine/detail" element={<RoutineDetail />}></Route>
                <Route path="/routine/run" element={<RoutineRun />}></Route>
                <Route path="/suggest" element={<Suggest />}></Route>
                <Route path="/shop" element={<Shop />}></Route>
              </Routes>
            </SuggestProvider>
          </RoutineProvider>
        </RunProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
