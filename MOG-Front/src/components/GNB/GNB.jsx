import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../pages/Login/AuthContext';
import { Offcanvas } from 'react-bootstrap';

export default function GNB() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  console.log(currentPath);
  const { user, dispatch } = useContext(AuthContext);
  const redirectLoginOrMypage = e => {
    e.preventDefault();
    if (!user) {
      window.alert('로그인 후 이용하세요');
      navigate('/login');
    } else navigate('/mypage');
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark fixed-top"
      id="mainNav"
      style={{ width: '100vw', zIndex: 10, backgroundColor: 'black', padding: '15px' }}
    >
      <Link className="navbar-brand" to="/">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <span style={{ color: '#ffc800' }}>MOG</span>
          <div style={{ fontSize: '10px' }}>my own gym</div>
        </div>
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarResponsive"
        aria-controls="navbarResponsive"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <i className="fas fa-bars" onClick={handleShow}></i>
      </button>
      <div className="collapse navbar-collapse" id="navbarResponsive">
        <ul className="navbar-nav text-uppercase ms-auto py-4 py-lg-0" style={{ flexWrap: 'wrap' }}>
          <li className="nav-item">
            {user ? (
              <Link className="nav-link" to="/routine">
                {currentPath === '/routine' ? (
                  <span style={{ color: '#ffc800' }}>
                    <strong>루틴</strong>
                  </span>
                ) : (
                  '루틴'
                )}
              </Link>
            ) : undefined}
          </li>
          <li className="nav-item">
            {user ? (
              <Link className="nav-link" to="/record">
                {currentPath === '/record' ? (
                  <span style={{ color: '#ffc800' }}>
                    <strong>기록</strong>
                  </span>
                ) : (
                  '기록'
                )}
              </Link>
            ) : undefined}
          </li>
          <li className="nav-item">
            {user ? (
              <Link className="nav-link" to="/stats">
                {currentPath === '/stats' ? (
                  <span style={{ color: '#ffc800' }}>
                    <strong>통계</strong>
                  </span>
                ) : (
                  '통계'
                )}
              </Link>
            ) : undefined}
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/social">
              {currentPath === '/social' ? (
                <span style={{ color: '#ffc800' }}>
                  <strong>소셜</strong>
                </span>
              ) : (
                '소셜'
              )}
            </Link>
          </li>
          <li className="nav-item">
            {user ? (
              <Link className="nav-link" to="/mypage">
                {currentPath === '/mypage' ? (
                  <span style={{ color: '#ffc800' }}>
                    <strong>마이페이지</strong>
                  </span>
                ) : (
                  '마이페이지'
                )}
              </Link>
            ) : undefined}
          </li>
          <li className="nav-item">
            {!user ? (
              <Link className="nav-link" to="/login">
                {currentPath === '/login' ? (
                  <span style={{ color: '#ffc800' }}>
                    <strong>로그인</strong>
                  </span>
                ) : (
                  '로그인'
                )}
              </Link>
            ) : (
              <Link className="nav-link" to="/" onClick={() => dispatch({ type: 'LOGOUT' })}>
                로그아웃
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
