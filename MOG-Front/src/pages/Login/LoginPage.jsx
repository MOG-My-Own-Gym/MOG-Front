import React, { useContext, useRef, useState } from 'react';
import './LoginPage.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  //유효성 검증용
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [loginErrMsg, setLoginErrMsg] = useState('');

  //로그인 버튼 이벤트 처리
  const handleLogin = e => {
    e.preventDefault(); //submit막기

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    //유효성 검증
    if (!email && !password) {
      setLoginErrMsg('아이디와 비밀번호를 입력해주세요');
      return;
    } else if (!email) {
      setLoginErrMsg('아이디를 입력해주세요');
      return;
    } else if (!password) {
      setLoginErrMsg('비밀번호를 입력해주세요');
      return;
    }

    axios
      .post('http://localhost:8080/api/v1/users/login', { email, password })
      .then(res => {
        console.log(res.data);
        dispatch({ type: 'LOGIN', user: res.data });
        navigate('/', { replace: true });
      })
      .catch(e => {
        setLoginErrMsg(e.response.data.split(':')[1]); //로그인 실패시 오류메세지 화면에 띄워주기
      });
  };

  return (
    <div className="login-container">
      {/*<img src="/img/moglogo.png" alt="MOG Logo" />*/}

      <h1 className="login-title">오늘도 MOG와 함께해요</h1>

      <form className="login-form">
        <input
          ref={emailRef}
          type="email"
          placeholder="이메일 주소"
          required
          className="login-input"
        />
        <input
          ref={passwordRef}
          type="password"
          placeholder="비밀번호"
          required
          className="login-input"
        />
        <button type="submit" className="login-button" onClick={handleLogin}>
          로그인
        </button>
        {loginErrMsg && (
          <span className="text-danger" id="loginError">
            {loginErrMsg}
          </span>
        )}
      </form>

      <div className="social-section">
        <span className="social-text">─── 또는 소셜 계정으로 로그인 ───</span>
        <div className="social-buttons">
          <button className="social-btn kakao">카카오</button>
          <button className="social-btn google">구글</button>
          <button className="social-btn naver">네이버</button>
        </div>
      </div>

      <div className="bottom-links">
        <Link to="/find-id">아이디 찾기</Link>
        <span className="link-separator">|</span>
        <Link to="/find-pw">비밀번호 찾기</Link>
        <span className="link-separator">|</span>
        <Link to="/sign-up">회원가입</Link>
      </div>
    </div>
  );
}
