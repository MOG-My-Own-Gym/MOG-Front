import axios from 'axios';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModalAlert } from '../../context/ModalAlertContext';

export default function FindPwPage() {
  const { showModal } = useModalAlert();

  //form으로 받은 이메일 데이터를 저장할 state
  const [formData, setFormData] = useState({
    email: '',
    usersName: '',
  });

  //비밀번호 변경 페이지로 이동하기 위한 navigate
  const navigate = useNavigate();

  //input입력값과 유효성체크메세지를 출력해주기 위한 ref
  const emailRef = useRef();
  const usernameRef = useRef();
  const spanErrorRef = useRef();

  //input입력값 제어하는 함수
  const handleChange = e => {
    const { name, value } = e.target;
    //제출 전에는 유효성 체크x
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  //비밀번호찾기 버튼 눌렀을때 적용되는 함수
  const handleSubmit = e => {
    //제출기능막기
    e.preventDefault();
    //에러메세지 초기화
    spanErrorRef.current.textContent = '';

    //유효성 체크
    if (emailRef.current.value === '' && usernameRef.current.value === '') {
      spanErrorRef.current.textContent = '이름 및 이메일을 모두 입력해주세요';
      return;
    } else if (emailRef.current.value === '') {
      spanErrorRef.current.textContent = '이메일을 입력해주세요';
      return;
    } else if (usernameRef.current.value === '') {
      spanErrorRef.current.textContent = '이름을 입력해주세요';
      return;
    }

    //유효성 체크에 통과하면 단일회원조회(이메일) api요청
    axios
      .get(`http://localhost:8080/api/v1/users/email/${formData.email}`)
      .then(res => {
        //이메일로 조회한 유저정보의 이름이 사용자가 입력한 이름과 같으면 비밀번호변경 페이지로 이동
        const userData = res.data;
        console.log(userData);
        if (userData.usersName === formData.usersName) {
          axios
            .post('http://localhost:8080/api/v1/users/send/password', formData)
            .then(res => {
              console.log(res);
              showModal('비밀번호 찾기 이메일 전송을 성공하였습니다');
            })
            .catch(error => {
              console.log(error);
              showModal('비밀번호 찾기 이메일 전송을 실패하였습니다');
            });
        } else {
          //이름이 일치하지 않을때 모달알러트 띄우기
          showModal('가입된 이름이 일치하지 않습니다');
          usernameRef.current.focus();
        }
      })
      .catch(err => {
        console.log(err);
        //이메일 조회 실패 모달알러트 띄우기
        showModal('해당 회원이 존재하지 않습니다');
        emailRef.current.focus();
      });
  };

  return (
    <>
      <div className="login-container">
        <h1 className="login-title">비밀번호 찾기</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="usersName"
            placeholder="이름 입력"
            className="login-input"
            ref={usernameRef}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="가입한 이메일"
            className="login-input"
            ref={emailRef}
            onChange={handleChange}
          />
          <button type="submit" className="login-button">
            비밀번호 찾기 이메일 발송
          </button>
        </form>
        <span ref={spanErrorRef} style={{ color: '#FF0000' }}></span>
      </div>
    </>
  );
}
