import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FindPwPage() {
  const [usersProfile, setUsersProfile]=useState({
    "usersId": "",
    "biosDto": {
        "bioId": "",
        "age": "",
        "gender": "",
        "height": "",
        "weight": ""
    },
    "usersName": "",
    "nickName": "",
    "email": "",
    "profileImg": "",
    "regDate": "",
    "updateDate": ""
  })
  const navigate = useNavigate();

  const emailRef = useRef();
  const usernameRef = useRef();
  const spanErrorRef = useRef();

  const handleChange =e=>{
    //제출 전에는 유효성 체크x
      if(e.target.name==='email')
        setUsersProfile(prev => ({ ...prev, email:e.target.value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    spanErrorRef.current.textContent='';

    //유효성 체크
    if(emailRef.current.value === '' && usernameRef.current.value ===''){
      spanErrorRef.current.textContent="이름 및 이메일을 모두 입력해주세요";
      return;
    }
    else if(emailRef.current.value === ''){
      spanErrorRef.current.textContent="이메일을 입력해주세요";
      return;
    }
    else if(usernameRef.current.value === ''){
      spanErrorRef.current.textContent="이름을 입력해주세요";
      return;
    }
    axios.get(`http://localhost:8080/api/v1/users/email/${usersProfile.email}`)
        .then(res => {
          console.log(res);
          
          if(res.data.usersName===usernameRef.current.value){
            setUsersProfile(res.data);
            navigate('/find-pw/change', { state: usersProfile })
          }
          else{
            //이름이 일치하지 않을때 에러 메세지 뿌리기
            spanErrorRef.current.textContent='가입된 이름이 일치하지 않습니다.';
            usernameRef.current.focus();
          }

        })
        .catch(err=>{
          console.log(err);
          //이메일 조회 실패 에러 메세지 뿌리기
          spanErrorRef.current.textContent='해당 회원이 존재하지 않습니다.';
          emailRef.current.focus();
        });

  };


  return <>
    <div className="login-container">
      <h1 className="login-title">비밀번호 찾기</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <input 
            type="text"
            name='username'
            placeholder="이름 입력"
            className="login-input"
            ref={usernameRef}
            onChange={handleChange}
          />
          <input
            type="email"
            name='email'
            placeholder="가입한 이메일"
            className="login-input"
            ref={emailRef}
            onChange={handleChange}
          />
          <button type="submit" className="login-button">
            비밀번호 찾기
          </button>
        </form>
        <span ref={spanErrorRef} style={{ color: '#FF0000' }}></span> 
      </div>
  </>
};
