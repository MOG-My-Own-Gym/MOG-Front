import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useModalAlert } from "../../context/ModalAlertContext";

export default function ChangePwPage(){
    const {showModal}=useModalAlert();
    const navigate = useNavigate();

    //유효성체크용 Ref
    const passwordRef = useRef();
    const spanErrorRef = useRef();

    //새 비밀번호와 비밀번호확인이 일치하는지 판단할 변수
    let isPasswordMatch = false;

    const handleChange=e=>{
        //비밀번호 확인 체크
        const { name, value } = e.target;
        if(name==='checkPassword'){
            if(value===passwordRef.current.value){
                spanErrorRef.current.textContent='비밀번호 일치';
                isPasswordMatch=true;
            }
            else {
                spanErrorRef.current.textContent='비밀번호 불일치';
                isPasswordMatch=false;
            }
        }
    };
    
    const handleSubmit=e=>{
        e.preventDefault();
        if(isPasswordMatch){
            //비밀번호 변경 로직 처리
            showModal('이메일을 통한 비밀번호 변경 로직 처리 예정');
            //로그인 페이지로 이동
            navigate('/login');
            return;
        }
        else {//비밀번호가 서로 일치하지 않은채로 제출하면 알림띄우기
            showModal('비밀번호가 일치하지 않습니다');
            return;
        }
    }

    return <>
        <div className="login-container">
            <h1 className="login-title">비밀번호 변경</h1>
            <form className="login-form" onSubmit={handleSubmit}>
                <input 
                    type="password"
                    name='password'
                    placeholder="새 비밀번호 입력"
                    className="login-input"
                    ref={passwordRef}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name='checkPassword'
                    placeholder="새 비밀번호 확인"
                    className="login-input"
                    onChange={handleChange}
                />
                <button type="submit" className="login-button">
                    비밀번호 찾기
                </button>
            </form>
            <span ref={spanErrorRef} style={{ color: '#0000FF' }}></span> 
        </div>
    
    </>
}