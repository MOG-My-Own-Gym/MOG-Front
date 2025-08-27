import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Login/AuthContext';
import { useModalAlert } from '../../context/ModalAlertContext';
import { Badge } from 'react-bootstrap';
import './css/profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { showModal } = useModalAlert();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 초기 프로필 데이터 설정
  const [profile, setProfile] = useState({
    name: '',
    nickName: '',
    email: user?.email || '',
    profileImg: '/img/userAvatar.png',
    phoneNum: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    regDate: '',
  });

  // 업적 데이터 (임시)
  const [unlockedAchievements] = useState([
    { id: 1, name: '첫 운동', icon: '🥇' },
    { id: 2, name: '연속 7일', icon: '🔥' },
    { id: 3, name: '근력 향상', icon: '💪' },
    { id: 4, name: '목표 달성', icon: '🎯' },
  ]);

  //최초렌더링 및 userId가 변하는 경우에 따라 user정보 네트워크로부터 읽어오기
  useEffect(() => {
    if (!user || !user.usersId) {
      setError('사용자 정보를 찾을 수 없습니다.');
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await axios.get(`http://localhost:8080/api/v1/users/${user.usersId}`);
        const getUser = res.data;
        const getBio = res.data.biosDto;
        
        //읽어온 정보로 프로필 state설정
        setProfile(prev => ({
          ...prev,
          name: getUser.usersName || '',
          nickName: getUser.nickName || '',
          profileImg: getUser.profileImg || '/img/userAvatar.png',
          phoneNum: getUser.phoneNum || '',
          age: getBio?.age || 0,
          gender: getBio?.gender !== undefined ? getBio.gender : null,
          height: getBio?.height || 0,
          weight: getBio?.weight || 0,
          regDate: getUser.regDate ? getUser.regDate.substring(0, 10) : '',
        }));
      } catch (e) {
        console.log(e.response?.data, e);
        setError('프로필을 읽어오는 중 오류가 발생하였습니다');
        showModal('프로필을 읽어오는 중 오류가 발생하였습니다');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user?.usersId, showModal]);

  // 로딩 중일 때
  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // 에러가 있을 때
  if (error) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container rounded bg-white mb-5">
        <div className="pt-2">
          <div className="row d-flex justify-content-around">
            <div className="col-md-3 border-right">
              <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                <img
                  className="rounded-circle mt-5"
                  width="150px"
                  src={profile.profileImg || '/img/userAvatar.png'}
                  alt={
                    (profile.profileImg && profile.profileImg.trim() === '/img/userAvatar.png')
                      ? 'meaicon - Flaticon 기본이미지'
                      : '개인 프로필 이미지'
                  }
                />
                <span className="font-weight-bold fs-2">{profile.nickName || '닉네임 없음'}</span>
                <span className="font-weight-bold fs-4">{profile.name || '이름 없음'}</span>
                <span className="text-black-50">{profile.email || '이메일 없음'}</span>
                
                {/* 업적 정보 */}
                <div className="mt-3">
                  <div className="d-flex justify-content-center align-items-center mb-2">
                    <span className="text-muted me-2">달성한 업적</span>
                    <Badge bg="success" className="fs-6">
                      {unlockedAchievements.length}개
                    </Badge>
                  </div>
                  
                  {/* 업적 뱃지들 */}
                  <div className="d-flex flex-wrap justify-content-center gap-1 mb-3">
                    {unlockedAchievements.slice(0, 6).map(achievement => (
                      <Badge 
                        key={achievement.id} 
                        bg="warning" 
                        text="dark"
                        className="fs-6 px-2 py-1"
                        title={achievement.name}
                      >
                        {achievement.icon}
                      </Badge>
                    ))}
                    {unlockedAchievements.length > 6 && (
                      <Badge bg="secondary" className="fs-6 px-2 py-1">
                        +{unlockedAchievements.length - 6}
                      </Badge>
                    )}
                  </div>
                  
                  {/* 레벨 및 업적 페이지로 이동 버튼 */}
                  <button
                    onClick={() => navigate('/mypage/gamification')}
                    className="btn btn-outline-warning btn-sm"
                  >
                    🏆 레벨 및 업적 보기
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-4 border-right">
              <div className="p-3 py-5">
                <div className="row mt-2">
                  <fieldset className="border rounded-3 p-3 col-md-12 profile-info">
                    <legend className="float-none w-auto px-3">Profile</legend>
                    <div className="profile-name">
                      <h6 className="text-primary fs-1 profile-name">{profile.name || '이름 없음'}</h6>
                    </div>
                    <hr className="text-secondary" />
                    <div className="profile-nickname pt-2">
                      <p>닉네임</p>
                      <h6 className="text-muted fw-bold">{profile.nickName || '닉네임 없음'}</h6>
                    </div>
                    <hr className="text-secondary" />
                    <div className="profile-email pt-2">
                      <p>아이디</p>
                      <h6 className="text-muted fw-bold">{profile.email || '이메일 없음'}</h6>
                    </div>
                    <hr className="text-secondary" />
                    <div className="profile-phoneNum pt-2">
                      <p>전화번호</p>
                      {
                        //전화번호가 11자리(핸드폰번호)인 경우 각 번호 사이에 - 표시하기
                        profile.phoneNum && profile.phoneNum.trim().length === 11 ? (
                          <h6 className="text-muted fw-bold">
                            {profile.phoneNum.substring(0, 3)}-{profile.phoneNum.substring(3, 7)}-
                            {profile.phoneNum.substring(7, profile.phoneNum.length)}
                          </h6>
                        ) : (
                          <h6 className="text-muted fw-bold">
                            {profile.phoneNum || '전화번호 정보가 없습니다'}
                          </h6>
                        )
                      }
                    </div>
                    <hr className="text-secondary" />
                    <div className="profile-regDate pt-2">
                      <p>가입일</p>
                      <h6 className="text-muted fw-bold">{profile.regDate || '가입일 정보가 없습니다'}</h6>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 py-5">
                <fieldset className="border rounded-3 p-3 body-info">
                  <legend className="float-none w-auto px-3">신체 정보</legend>
                  <div className="physical-info-height">
                    <p>나이</p>
                    {
                      //선택정보가 없는 경우 정보가 없다고 표시
                      profile.age && profile.age !== 0 ? (
                        <span className="text-muted fw-bold">{profile.age}세</span>
                      ) : (
                        <span className="text-muted">나이 정보가 없습니다.</span>
                      )
                    }
                  </div>
                  <hr className="text-secondary" />
                  <div className="physical-info-height">
                    <p>성별</p>
                    <span className="text-muted fw-bold">
                      {profile.gender === false ? '남자' : profile.gender === true ? '여자' : '성별 정보가 없습니다'}
                    </span>
                  </div>
                  <hr className="text-secondary" />
                  <div className="physical-info-height">
                    <p>키</p>
                    {profile.height && profile.height !== 0 ? (
                      <span className="text-muted fw-bold">{profile.height}cm</span>
                    ) : (
                      <span className="text-muted">키 정보가 없습니다.</span>
                    )}
                  </div>
                  <hr className="text-secondary" />
                  <div className="physical-info-height">
                    <p>몸무게</p>
                    {profile.weight && profile.weight !== 0 ? (
                      <span className="text-muted fw-bold">{profile.weight}kg</span>
                    ) : (
                      <span className="text-muted">몸무게 정보가 없습니다.</span>
                    )}
                  </div>
                </fieldset>
              </div>
              <div className="mt-5 text-center">
                <button
                  onClick={() => navigate('/mypage/edit', { state: profile })}
                  className="btn btn-warning profile-button"
                  type="button"
                >
                  프로필 수정
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
