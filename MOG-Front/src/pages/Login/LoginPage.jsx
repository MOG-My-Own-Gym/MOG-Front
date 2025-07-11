
import React from 'react';
import './LoginPage.css';
import { Link } from 'react-router-dom';


export default function LoginPage() {
  return (
    <div className="login-container">
      {/*<img src="/img/moglogo.png" alt="MOG Logo" />*/}
    
      <h1 className="login-title">오늘도 MOG와 함께해요</h1>
      
      <form className="login-form">
        <input
          type="email"
          placeholder="이메일 주소"
          required
          className="login-input"
        />
        <input
          type="password"
          placeholder="비밀번호"
          required
          className="login-input"
        />
        <button type="submit" className="login-button">
          로그인
        </button>
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
        <a href="/sign-up">회원가입</a>
      </div>
    </div>
  );
}
