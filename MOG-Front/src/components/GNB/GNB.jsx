import { Link } from 'react-router-dom';

export default function GNB() {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark fixed-top"
      id="mainNav"
      style={{ zIndex: 10 }}
    >
      <div className="container">
        <Link className="navbar-brand" to="/">
          <span>제목예시(홈 버튼)</span>
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
              <Link className="nav-link" to="services">
                로그인
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="record">
                기록
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="stats">
                통계
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="social">
                소셜
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="team">
                사용자 화면
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
