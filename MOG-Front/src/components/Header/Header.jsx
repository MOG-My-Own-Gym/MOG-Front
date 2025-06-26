import { useContext } from 'react';
import { Link } from 'react-router-dom';
import ToastContext from '../../context/ToastContext';

export default function Header() {
  const { toast, dispatch } = useContext(ToastContext);
  return (
    <header className="masthead" style={{ backgroundImage: `url(/img/hell.jpg)` }}>
      <div className="container">
        <div className="masthead-subheading">당신의 헬스 트레이너</div>
        <div className="masthead-heading text-uppercase">만나서 반갑습니다.</div>
        <Link className="btn btn-primary btn-xl text-uppercase" to="services">
          로그인
        </Link>

        {/* <button
          onClick={() => {
            dispatch({ type: 'SHOW_TOAST', payload: '토스트 컨텐트' });
          }}
        >
          토스트 테스트용 버튼
        </button> */}
      </div>
    </header>
  );
}
