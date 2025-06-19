import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="masthead" style={{ backgroundImage: `url(/img/hell.jpg)` }}>
      <div className="container">
        <div className="masthead-subheading">당신의 헬스 트레이너</div>
        <div className="masthead-heading text-uppercase">만나서 반갑습니다.</div>
        <Link className="btn btn-primary btn-xl text-uppercase" to="services">
          로그인
        </Link>
      </div>
    </header>
  );
}
