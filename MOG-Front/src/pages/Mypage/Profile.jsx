import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Login/AuthContext';
import { useModalAlert } from '../../context/ModalAlertContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { showModal } = useModalAlert();

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
        .get(`https://mogapi.kro.kr/api/v1/users/${user.usersId}`) //로그인시 저장된 userId에 따라 단일 회원 조회 api요청
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
            age: getBio.age,
            gender: getBio.gender,
            height: getBio.height,
            weight: getBio.weight,
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
      <h1 id="padding" style={{ marginTop: '55px', fontWeight: 'bold' }}>
        프로필
      </h1>
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
