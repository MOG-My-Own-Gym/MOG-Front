import axios from "axios";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useModalAlert } from "../../context/ModalAlertContext";

export default function ChangePwPage(){
    const {showModal}=useModalAlert();
    const { state } = useLocation();
    const navigate = useNavigate();

    const passwordRef = useRef();
    const spanErrorRef = useRef();

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
            return;
        }
        else {
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