import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../pages/Login/AuthContext';

export default function GNB() {
  const navigate = useNavigate();
  const {user, dispatch}=useContext(AuthContext);
  const redirectLoginOrMypage=e=>{
    e.preventDefault();
    if(!user){
      window.alert('로그인 후 이용하세요');
      navigate('/login')
    }
    else navigate('/mypage');
  };

  return (
    <nav
      className='navbar navbar-expand-lg navbar-dark fixed-top'
      id="mainNav"
      style={{ zIndex: 10, backgroundColor: 'black' }}
    >
      <div className="container">
        <Link className="navbar-brand" to="/">
          <span><i className="fa-solid fa-house">MOG</i></span>
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
          Menu
          <i className="fas fa-bars ms-1"></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
            <li className="nav-item">
              {
                user ?
                <Link className="nav-link" to="/record">
                  기록
                </Link>
                :
                undefined
              }
            </li>
            <li className="nav-item">
              {
                user?
                <Link className="nav-link" to="/stats">
                  통계
                </Link>
                :
                undefined
              }
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/social">
                소셜
              </Link>
            </li>
            <li className="nav-item">
              {
                user?
                <Link className="nav-link" to="/mypage">
                  마이 페이지
                </Link>
                :
                undefined
              }
            </li>
            <li className="nav-item">
              {
                !user?
                <Link className="nav-link" to="/login">
                  로그인
                </Link>
                :
                <Link className='nav-link' to="/" onClick={()=>dispatch({type:'LOGOUT'})}>로그아웃</Link>
              }
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
