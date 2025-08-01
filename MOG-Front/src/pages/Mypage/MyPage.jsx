import { Link, Route, Routes, useLocation } from 'react-router-dom';
import styles from './css/MyPage.module.css';
import Profile from './Profile';
import MyRoutine from './MyRoutine';
import MySocial from './MyTrace';
import Settings from './Settings';
import Support from './Support';
import ProfileEdit from './ProfileEdit';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../Login/AuthContext';
import { useModalAlert } from '../../context/ModalAlertContext';
import { Container } from 'react-bootstrap';

export default function MyPage() {
  const { showModal } = useModalAlert();
  //저장되어있는 유저정보 가져오기
  const { user } = useContext(AuthContext);
  //유저 닉네임 저장할 state(사이드바 제일 아래쪽에 닉네임 띄워주기 위함)
  const [userNickName, setUserNickName] = useState('');
  //모바일메뉴가 열려있는지 여부 판단하는 state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  //현재 path경로 가져오기 위한 useLocation
  const location = useLocation();

  //사이드바 글씨색상을 변하게하기 위한 path경로 일치 여부 판단 함수
  const isPathMatch = pathname => {
    if (pathname === '/mypage') {
      //mypage로 시작하는 경로 중 /mypage(Profile)와 /mypage/edit(ProfileEdit)을 같은 경로 취급
      return location.pathname === '/mypage' || location.pathname === '/mypage/edit';
    }
    if (pathname === '/mypage/support') {
      //mypage/support로 시작하는 경로 같은 경로 취급
      return location.pathname.startsWith('/mypage/support');
    }
    return location.pathname === pathname;
  };

  //최초렌더링 시 유저정보 조회
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/users/${user.usersId}`)
      .then(res => {
        //조회한 유저정보의 닉네임 저장 -> 사이드바 아래에 뿌려주기위함
        setUserNickName(res.data.nickName);
      })
      .catch(err => {
        console.log(err);
        showModal('사용자 정보를 가져오는 중 오류가 발생하였습니다.');
      });
  }, []);

  useEffect(() => {
    if (location.pathname.includes('mypage')) document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  //플로팅버튼을 누름에 따라 모바일메뉴 오픈 여부 토글하는 함수
  const toggleMobileMenu = e => {
    e.preventDefault();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  //최초렌더링시와 isMobileMenuOpen스테이트에 따라 렌더링된다
  useEffect(() => {
    //모바일메뉴가 열려있으면 스크롤기능x
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  //모바일메뉴에서 연결된 다른 페이지(예:프로필->고객센터)로 넘어갔을때 모바일메뉴 닫는 함수
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  //모바일의 Link용 배열(데스크톱/태블릿용은 간헐적으로 괘선이 포함되어있어 사용하지 않는 편이 코드가 덜 지저분 하다)
  const menuItem = [
    { path: '/mypage', icon: 'fa-solid fa-circle-user', name: '프로필' },
    { path: '/mypage/myroutine', icon: 'fa-solid fa-dumbbell', name: '나의 루틴' },
    { path: '/mypage/mysocial', icon: 'fa-solid fa-image', name: '나의 기록' },
    { path: '/mypage/settings', icon: 'fa-solid fa-gear', name: '환경설정' },
    { path: '/mypage/support', icon: 'fa-solid fa-phone', name: '고객센터' },
  ];

  return (
    <>
      <div className={`d-flex ${styles.mypageWrapper}`}>
        {/*데스크톱/태블릿용 사이드바 시작 */}
        <div
          className={`${styles.sidebarMain} d-none d-md-block col-md-3 col-lg-2 bg-black text-white px-3`}
        >
          <div className="d-flex flex-column justify-content-between h-100">
            <div>
              <ul className={`nav ${styles.navPillsMypage} flex-column px-0`}>
                <li className="nav-item fs-4 my-1 py-2 py-sm-0 mt-4">
                  <Link
                    to="/mypage"
                    className={
                      isPathMatch(menuItem[0].path)
                        ? `nav-link text-white px-2 fs-5 ${styles.activeLink}`
                        : 'nav-link text-white px-2 fs-5'
                    }
                  >
                    <i className="fa-solid fa-circle-user me-3 ps-sm-0 ps-3"></i>
                    <span className="d-none d-sm-inline">프로필</span>
                  </Link>
                </li>
                <hr className="text-secondary d-none d-sm-block" />
                <li className="nav-item fs-4 my-1 py-2 py-sm-0 mt-4">
                  <Link
                    to="/mypage/myroutine"
                    className={
                      isPathMatch(menuItem[1].path)
                        ? `nav-link text-white px-2 fs-5 ${styles.activeLink}`
                        : 'nav-link text-white px-2 fs-5'
                    }
                  >
                    <i className="fa-solid fa-dumbbell me-3 ps-sm-0 ps-3"></i>
                    <span className="d-none d-sm-inline">나의 루틴</span>
                  </Link>
                </li>
                <li className="nav-item fs-4 my-1 py-2 py-sm-0 mt-4">
                  <Link
                    to="/mypage/mysocial"
                    className={
                      isPathMatch(menuItem[2].path)
                        ? `nav-link text-white px-2 fs-5 ${styles.activeLink}`
                        : 'nav-link text-white px-2 fs-5'
                    }
                  >
                    <i className="fa-solid fa-image me-3 ps-sm-0 ps-3"></i>
                    <span className="d-none d-sm-inline">나의 기록</span>
                  </Link>
                </li>
                <hr className="text-secondary d-none d-sm-block" />
                <li className="nav-item fs-4 my-1 py-2 py-sm-0 mt-4">
                  <Link
                    to="/mypage/settings"
                    className={
                      isPathMatch(menuItem[3].path)
                        ? `nav-link text-white px-2 fs-5 ${styles.activeLink}`
                        : 'nav-link text-white px-2 fs-5'
                    }
                  >
                    <i className="fa-solid fa-gear me-3 ps-sm-0 ps-3"></i>
                    <span className="d-none d-sm-inline">환경설정</span>
                  </Link>
                </li>
                <li className="nav-item fs-4 my-1 py-2 py-sm-0 mt-4">
                  <Link
                    to="/mypage/support"
                    className={
                      isPathMatch(menuItem[4].path)
                        ? `nav-link text-white px-2 fs-5 ${styles.activeLink}`
                        : 'nav-link text-white px-2 fs-5'
                    }
                  >
                    <i className="fa-solid fa-phone me-3 ps-sm-0 ps-3"></i>
                    <span className="d-none d-sm-inline">고객센터</span>
                  </Link>
                </li>
              </ul>
            </div>
            {/*사이드바 맨 아래쪽에 유저닉네임 띄워주는 코드 */}
            <div className="py-4">
              <hr className="text-secondary" />
              <div className="d-flex justify-content-center">
                <i className="fa-solid fa-user fs-5 me-2"></i>
                <span className="d-none d-sm-inline">{userNickName}</span>
              </div>
            </div>
          </div>
        </div>
        {/*데스크톱/태블릿용 사이드바 끝 */}

        {/*모바일용 플로팅 버튼(md이하에서만 보임) */}
        <div className={`d-md-none ${styles.floatingButtonContainer}`}>
          <button
            className={`btn btn-warning rounded-circle ${styles.floatingButton} ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <i className="fa-solid fa-times fs-3"></i>
            ) : (
              <i className="fa-solid fa-bars fs-3"></i>
            )}
          </button>
        </div>

        {/*버튼 클릭시 나타나는 모바일 메뉴 오버레이 */}
        {isMobileMenuOpen && (
          <>
            <div className={styles.mobileMenuOverlay} onClick={toggleMobileMenu}></div>
            <div className={styles.mobileMenuContent}>
              <ul className="list-group">
                {menuItem.map(item => (
                  <li className="list-group-item" key={item.path}>
                    <Link
                      to={item.path}
                      className={`nav-link text-decoration-none w-100 text-start ${isPathMatch(item.path) ? `${styles.activeLink}` : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <i className={`${item.icon} me-3`}></i>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <Container className={styles.mainContentArea}>
          <Routes>
            <Route path="" element={<Profile />}></Route>
            <Route path="/edit" element={<ProfileEdit />}></Route>
            <Route path="/myroutine" element={<MyRoutine />}></Route>
            <Route path="/mysocial" element={<MySocial />}></Route>
            <Route path="/settings" element={<Settings />}></Route>
            <Route path="/support/*" element={<Support />}></Route>
          </Routes>
        </Container>
      </div>
    </>
  );
}
