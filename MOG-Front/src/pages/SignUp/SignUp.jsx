import { useRef, useState } from 'react';
import './SignUp.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useModalAlert } from '../../context/ModalAlertContext';

export default function SignUp() {
  const { showModal } = useModalAlert();
  const navigator = useNavigate();

  //input입력값 저장하기위한 state
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNum: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
  });
  const {
    name,
    nickname,
    email,
    password,
    confirmPassword,
    phoneNum,
    age,
    gender,
    height,
    weight,
  } = formData;

  //input및 유효성 체크용 Ref
  const checkEmailRef = useRef();
  const checkNameRef = useRef();
  const checkNicknameRef = useRef();
  const checkPasswordRef = useRef();
  const passwordCheckResult = useRef();
  const emailCheckResult = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const checkCallRef = useRef();

  //input입력값 제어하는 함수
  const handleChange = e => {
    const { name, value } = e.target;
    //유효성 체크
    if (name === 'email')
      checkEmailRef.current.textContent = value.trim() === '' ? '이메일을 입력하세요' : '';
    else if (name === 'name')
      checkNameRef.current.textContent = value.trim() === '' ? '이름을 입력하세요' : '';
    else if (name === 'nickname')
      checkNicknameRef.current.textContent = value.trim() === '' ? '닉네임을 입력하세요' : '';
    else if (name === 'password')
      checkPasswordRef.current.textContent = value.trim() === '' ? '비밀번호를 입력하세요' : '';
    else if (name === 'phoneNum')
      checkCallRef.current.textContent = value.trim() === '' ? '전화번호를 입력하세요' : '';

    //비밀번호 확인
    if (name === 'confirmPassword') {
      if (value === passwordRef.current.value) {
        passwordCheckResult.current.textContent = value.trim() === '' ? '' : '비밀번호 일치';
        //비밀번호가 일치하는 경우만 confirmPassword 키 저장
        setFormData(prev => ({ ...prev, confirmPassword: value }));
      } else if (value !== passwordRef.current.value) {
        passwordCheckResult.current.textContent =
          value.trim() === '' ? '' : '비밀번호가 일치하지 않습니다';
      }
    }
    //gender값 저장용
    else if (name === 'gender') {
      if (value === 'true') setFormData(prev => ({ ...prev, gender: true }));
      else setFormData(prev => ({ ...prev, gender: false }));
    } else setFormData(prev => ({ ...prev, [name]: value }));
  };

  //회원가입버튼 제어용 함수
  const handleSubmit = e => {
    e.preventDefault();

    //이메일 중복여부 체크하는 함수
    const handleCheckEmail = e => {
      e.preventDefault();
      //단일회원조회(이메일)api요청
      axios
        .get(`https://mogapi.kro.kr/api/v1/users/email/${emailRef.current.value}`)
        .then(res => {
          //회원조회에 성공한 경우 -> 중복되는 이메일인 경우
          emailCheckResult.current.textContent = '이미 존재하는 아이디 입니다';
          emailRef.current.value = ''; //email을 지워주므로 회원가입하려면 다시 입력해야함
          emailRef.current.focus();
        })
        .catch(err => {
          //조회에 실패한 경우 -> 존재하지 않는 회원 즉, 중복되지 않은 이메일인 경우
          if (err.status) {
            if (err.status === 400) {
              emailCheckResult.current.textContent = '사용 가능한 아이디입니다';
              return;
            }
          } else {
            //console.log(err);
            showModal('아이디 중복 조회 중 오류가 발생하였습니다');
          }
        });
    };
    if (emailCheckResult.current.textContent.trim() === '') {
      showModal('아이디의 중복여부를 확인해 주세요');
      emailRef.current.focus();
      return;
    }
    if (confirmPassword.trim().length === 0) {
      showModal('비밀번호가 일치하지 않습니다.');
      document.querySelector('input[name="confirmPassword"]').focus();
      return;
    }

    //유효성 체크를 통과한경우에만 회원가입 api 요청
    axios
      .post('https://mogapi.kro.kr/api/v1/users/signup', {
        usersName: name,
        email: email,
        profileImg: '/img/userAvatar.png', //프로필이미지는 기본이미지로 전달
        nickName: nickname,
        phoneNum: phoneNum,
        biosDto: {
          gender: gender,
          age: age,
          height: height,
          weight: weight,
        },
        authDto: {
          password: confirmPassword,
        },
      })
      .then(resp => {
        showModal('회원가입 완료');
        navigator('/login');
      })
      .catch(err => {
        //console.log(err);
        showModal('회원가입 실패');
      });
  };

  //이메일 중복여부 체크하는 함수
  const handleCheckEmail = e => {
    e.preventDefault();
    //단일회원조회(이메일)api요청
    axios
      .get(`https://mogapi.kro.kr/api/v1/users/email/${emailRef.current.value}`)
      .then(res => {
        //회원조회에 성공한 경우 -> 중복되는 이메일인 경우
        emailCheckResult.current.textContent = '이미 존재하는 아이디 입니다';
        emailRef.current.value = ''; //email을 지워주므로 회원가입하려면 다시 입력해야함
        emailRef.current.focus();
      })
      .catch(err => {
        //조회에 실패한 경우 -> 존재하지 않는 회원 즉, 중복되지 않은 이메일인 경우
        //console.log(err);

        if (err.code === 'ERR_NETWORK') showModal('아이디 중복 조회에 실패하였습니다');
        else emailCheckResult.current.textContent = '사용 가능한 아이디입니다';
      });
  };

  return (
    <>
      <div className="signup-container">
        <h1 className="signup-title">회원가입</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div>
            {/**필수항목 */}
            <div>
              <div>
                <label>아이디</label>
                <span className="text-danger fs-5 mx-2">*</span>
                <span ref={emailCheckResult} style={{ color: '#0000FF' }}></span>
                <div className="check-row">
                  <input
                    ref={emailRef}
                    className="form-control"
                    type="email"
                    name="email"
                    placeholder="이메일"
                    onChange={handleChange}
                  />
                  <button type="button" className="check-btn" onClick={handleCheckEmail}>
                    중복확인
                  </button>
                </div>
                <span ref={checkEmailRef} style={{ color: '#FF0000' }}></span>
              </div>
              <div>
                <label>이름</label>
                <span className="text-danger fs-5 mx-2">*</span>
                <input
                  className="form-control"
                  name="name"
                  placeholder="이름"
                  onChange={handleChange}
                />
                <span ref={checkNameRef} style={{ color: '#FF0000' }}></span>
              </div>
              <div>
                <label>닉네임</label>
                <span className="text-danger fs-5 mx-2">*</span>
                <input
                  className="form-control"
                  name="nickname"
                  placeholder="닉네임"
                  onChange={handleChange}
                />
                <span ref={checkNicknameRef} style={{ color: '#FF0000' }}></span>
              </div>
              <div>
                <label>비밀번호</label>
                <span className="text-danger fs-5 mx-2">*</span>
                <input
                  ref={passwordRef}
                  className="form-control"
                  name="password"
                  type="password"
                  placeholder="비밀번호"
                  onChange={handleChange}
                />
                <span ref={checkPasswordRef} style={{ color: '#FF0000' }}></span>
              </div>
              <div>
                <label>비밀번호 확인</label>
                <span className="text-danger fs-5 mx-2">*</span>
                <input
                  className="form-control"
                  name="confirmPassword"
                  type="password"
                  placeholder="비밀번호 확인"
                  onChange={handleChange}
                />
                <span ref={passwordCheckResult} style={{ color: '#0000FF' }}></span>
              </div>
              <div>
                <label>전화번호</label>
                <span className="text-danger fs-5 mx-2">*</span>
                <input
                  className="form-control"
                  name="phoneNum"
                  type="number"
                  placeholder="전화번호 (-을 제외한 숫자만 입력해 주세요)"
                  onChange={handleChange}
                />
                <span ref={checkCallRef} style={{ color: '#FF0000' }}></span>
              </div>
            </div>

            {/*선택 항목세션? */}
            <hr className="mt-4" />
            <div className="signup-section-title">선택 정보</div>
            <div>
              <label>성별</label>
              <div className="d-flex flex-column">
                <div className="form-check d-flex flex-row">
                  <input
                    className="mx-3"
                    type="radio"
                    name="gender"
                    value="false"
                    onChange={handleChange}
                  />
                  <label htmlFor="male">남자</label>
                </div>
                <div className="form-check d-flex flex-row">
                  <input
                    className="mx-3"
                    type="radio"
                    name="gender"
                    value="true"
                    onChange={handleChange}
                  />
                  <label htmlFor="female">여자</label>
                </div>
              </div>
            </div>
            <div className="d-flex flex-column">
              <label>나이</label>
              <input
                className="col-6"
                name="age"
                type="number"
                placeholder="나이 (선택)"
                onChange={handleChange}
              />

              <label>키</label>
              <div>
                <input name="height" type="number" placeholder="키 (cm)" onChange={handleChange} />
                <span className="mx-2">cm</span>
              </div>

              <label>몸무게</label>
              <div>
                <input
                  name="weight"
                  type="number"
                  placeholder="몸무게 (kg)"
                  onChange={handleChange}
                />
                <span className="mx-2">kg</span>
              </div>
            </div>
            <div className="d-flex justify-content-center pt-5">
              <button type="submit" className="signup-button">
                회원가입
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
