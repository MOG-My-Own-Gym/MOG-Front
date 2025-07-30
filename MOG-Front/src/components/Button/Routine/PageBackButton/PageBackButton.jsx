import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export default function PageBackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const [param] = useSearchParams();
  const routineId = param.get('routineId');
  console.log(location.pathname);
  console.log(routineId);

  const handleBack = currentPath => {
    switch (currentPath) {
      case '/routine':
        navigate('/');
        break;
      case '/routine/run':
        navigate('/routine');
        break;
      case '/routine/detail':
        navigate(`/routine/run?routineId=${routineId}`);
        break;
      case '/routine/select':
        if (routineId) navigate(`/routine/run?routineId=${routineId}`);
        else navigate('/routine');
        break;
    }
  };
  return (
    <div
      style={{ display: 'flex', gap: '0.5em', alignItems: 'center', cursor: 'pointer' }}
      onClick={() => {
        handleBack(location.pathname);
      }}
    >
      <i class="fa-solid fa-angle-left"></i>뒤로가기
    </div>
  );
}
