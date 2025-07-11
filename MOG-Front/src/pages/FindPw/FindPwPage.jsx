import axios from "axios";
import { useState } from "react";

export default function FindPwPage() {
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      userId: userId,
      email: email,
    };

    try {
      const response = await axios.post(
        'https://jsonplaceholder.typicode.com/posts', // 테스트용 주소
        requestData
      );

      // 테스트용 API는 'id' 값만 반환하므로 임시 처리
      if (response.data.id) {
        setMessage('임시 비밀번호가 발송되었습니다.');
        setIsError(false);
      } else {
        setMessage('비밀번호를 찾을 수 없습니다.');
        setIsError(true);
      }
    } catch (error) {
      console.log('전송된 데이터:', requestData);
      setMessage('서버 연결 실패');
      setIsError(true);
    }
  };

  return <>
    <div className="login-container">
      <h1 className="login-title">비밀번호 찾기</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="아이디 입력"
          required
          className="login-input"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="email"
          placeholder="가입한 이메일"
          required
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="login-button">
          비밀번호 찾기
        </button>
      </form>
      {message && (
        <p className={`info-message ${isError ? 'error-message' : ''}`}>
          {message}
        </p>
      )}
    </div>
  </>
}
