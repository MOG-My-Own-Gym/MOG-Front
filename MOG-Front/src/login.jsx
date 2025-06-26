import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = e => {
    e.preventDefault();

    if (username && password) {
      sessionStorage.setItem('username', username);
      navigate('/home');
    } else {
      alert('아이디와 비밀번호를 입력하세요');
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}
