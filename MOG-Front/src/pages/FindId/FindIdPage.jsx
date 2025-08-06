import { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useModalAlert } from '../../context/ModalAlertContext';

export default function FindIdPage() {
  //모달알러트사용을 위한 훅
  const { showModal } = useModalAlert();

  //form으로 받은 데이터를 저장할 state
  const [formData, setFormData] = useState({
    usersName: '',
    phoneNum: '',
  });
  const { usersName, phoneNum } = formData;

  //유저 여부 판단을 위한 state : 초기값 false
  const [isUser, setIsUser] = useState(false);

  //유저가 맞다면 유저 정보를 저장(찾은 유저정보(아이디)를 반환해주기 위함)할 state
  const [user, setUser] = useState({
    nickName: '',
    email: '',
  });

  //input입력값과 유효성체크메세지를 출력해주기 위한 ref
  const phoneNumRef = useRef();
  const usernameRef = useRef();
  const spanErrorRef = useRef();
  const navigate = useNavigate();

  //input입력값 제어하는 함수
  const handleChange = e => {
    const { name, value } = e.target;
    //제출전에는 유효성체크x, formData에 바로 저장해주기
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  //아이디찾기 버튼 눌렀을때 적용되는 함수
  const handleSubmit = e => {
    //button의 기본 제출기능 막아주기
    e.preventDefault();
    //유효성 체크
    if (phoneNum.trim().length === 0 && usersName.trim().length === 0) {
      spanErrorRef.current.textContent = '이름 및 전화번호를 모두 입력해주세요';
      return;
    } else if (phoneNum.trim().length === 0) {
      spanErrorRef.current.textContent = '전화번호를 입력해주세요';
      return;
    } else if (usersName.trim().length === 0) {
      spanErrorRef.current.textContent = '이름을 입력해주세요';
      return;
    }

    //유효성체크에 걸리지 않고 내려왔다면 axios로 아이디찾기 api 요청
    axios
      .post('https://mogapi.kro.kr/api/v1/users/auth/email/find', formData)
      .then(res => {
        //아이디찾기 성공한 경우
        //유저정보 저장
        setUser({ nickName: res.data.nickName, email: res.data.email });
        //유저여부 true로 변경
        setIsUser(true);
      })
      .catch(err => {
        //에러출력
        //모달알러트 띄우기
        showModal('아이디 찾기에 실패하였습니다.');
      });
  };

  return (
    <>
      <div className="login-container">
        <h1 className="login-title">아이디 찾기</h1>
        {!isUser ? ( //유저가 아니라면 아이디 찾는 코드 띄우기
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="가입한 이름을 입력해주세요"
              name="usersName"
              className="login-input"
              ref={usernameRef}
              onChange={handleChange}
            />
            <input
              type="number"
              placeholder="가입한 전화번호를 숫자만 입력해주세요"
              name="phoneNum"
              className="login-input"
              ref={phoneNumRef}
              onChange={handleChange}
            />
            <button type="submit" className="login-button">
              아이디 찾기
            </button>
          </form>
        ) : (
          //유저가 맞다면 찾은 유저정보 반환해주기
          <div>
            <span className="text-bold fs-4" style={{ color: 'rgb(255, 200, 2)' }}>
              {user.nickName}
            </span>
            <span className="fs-5">님의 아이디는 </span>
            <span className="text-bold fs-3" style={{ color: 'rgb(255, 200, 2)' }}>
              {user.email}
            </span>
            <span className="fs-5">입니다.</span>
            <div>
              <button
                className="btn mt-5"
                style={{ backgroundColor: 'rgb(255, 200, 2)', color: 'white' }}
                onClick={e => {
                  e.preventDefault();
                  navigate('/login');
                }}
              >
                로그인페이지로 이동
              </button>
            </div>
          </div>
        )}
        <span ref={spanErrorRef} style={{ color: '#FF0000' }}></span>
      </div>
    </>
  );
}
