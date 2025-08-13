import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Login/AuthContext';
import { useModalAlert } from '../../context/ModalAlertContext';
import AchievementService from './services/achievementService';
import achievementConfig from './data/achievements.json';
import { Badge } from 'react-bootstrap';
import './css/profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { showModal } = useModalAlert();
  
  // 업적 관련 상태
  const [achievementService] = useState(() => new AchievementService(achievementConfig));
  const [userSessions, setUserSessions] = useState([]); // 실제 운동 데이터로 교체
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);

  // 업적 달성 상태 업데이트
  useEffect(() => {
    const unlocked = achievementService.checkAllAchievements(achievementConfig.achievements, userSessions);
    setUnlockedAchievements(unlocked);
  }, [userSessions, achievementService]);

  // 초기 프로필 데이터 설정
  const [profile, setProfile] = useState({
    name: '',
    nickName: '',
    email: `${user.email}`,
    profileImg: '/img/userAvatar.png', //초기데이터 기본 프로필이미지로 설정
    phoneNum: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    regDate: '',
  });

  //최초렌더링 및 userId가 변하는 경우에 따라 user정보 네트워크로부터 읽어오기
  useEffect(() => {
    const fetchProfile = async () => {
      await axios
        .get(`http://localhost:8080/api/v1/users/${user.usersId}`) //로그인시 저장된 userId에 따라 단일 회원 조회 api요청
        .then(res => {
          const getUser = res.data;
          const getBio = res.data.biosDto;
          //읽어온 정보로 프로필 state설정
          setProfile(prev => ({
            ...prev,
            name: getUser.usersName,
            nickName: getUser.nickName,
            profileImg: getUser.profileImg,
            phoneNum: getUser.phoneNum,
            age: getBio?.age,
            gender: getBio?.gender,
            height: getBio?.height,
            weight: getBio?.weight,
            regDate: getUser.regDate.substring(0, 10),
          }));
        })
        .catch(e => {
          console.log(e.response.data, e);
          showModal('프로필을 읽어오는 중 오류가 발생하였습니다');
        });
    };
    fetchProfile();
  }, [user.usersId]);

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
                  src={profile.profileImg}
                  alt={
                    profile.profileImg.trim() === '/img/userAvatar.png'
                      ? 'meaicon - Flaticon 기본이미지'
                      : '개인 프로필 이미지'
                  }
                />
                <span className="font-weight-bold fs-2">{profile.nickName}</span>
                <span className="font-weight-bold fs-4">{profile.name}</span>
                <span className="text-black-50">{profile.email}</span>
                
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
                      <h6 className="text-primary fs-1 profile-name">{profile.name}</h6>
                    </div>
                    <hr className="text-secondary" />
                    <div className="profile-nickname pt-2">
                      <p>닉네임</p>
                      <h6 className="text-muted fw-bold">{profile.nickName}</h6>
                    </div>
                    <hr className="text-secondary" />
                    <div className="profile-email pt-2">
                      <p>아이디</p>
                      <h6 className="text-muted fw-bold">{profile.email}</h6>
                    </div>
                    <hr className="text-secondary" />
                    <div className="profile-phoneNum pt-2">
                      <p>전화번호</p>
                      {
                        //전화번호가 11자리(핸드폰번호)인 경우 각 번호 사이에 - 표시하기
                        profile.phoneNum.trim().length === 11 ? (
                          <h6 className="text-muted fw-bold">
                            {profile.phoneNum.substring(0, 3)}-{profile.phoneNum.substring(3, 7)}-
                            {profile.phoneNum.substring(7, profile.phoneNum.length)}
                          </h6>
                        ) : (
                          <h6 className="text-muted fw-bold">{profile.phoneNum}</h6>
                        )
                      }
                    </div>
                    <hr className="text-secondary" />
                    <div className="profile-regDate pt-2">
                      <p>가입일</p>
                      <h6 className="text-muted fw-bold">{profile.regDate}</h6>
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
                      profile.age !== 0 ? (
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
                      {profile.gender === false ? '남자' : '여자'}
                    </span>
                  </div>
                  <hr className="text-secondary" />
                  <div className="physical-info-height">
                    <p>키</p>
                    {profile.height !== 0 ? (
                      <span className="text-muted fw-bold">{profile.height}cm</span>
                    ) : (
                      <span className="text-muted">나이 정보가 없습니다.</span>
                    )}
                  </div>
                  <hr className="text-secondary" />
                  <div className="physical-info-height">
                    <p>몸무게</p>
                    {profile.weight !== 0 ? (
                      <span className="text-muted fw-bold">{profile.weight}kg</span>
                    ) : (
                      <span className="text-muted">나이 정보가 없습니다.</span>
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
