import { useRef, useState } from "react"
import axios from "axios";

export default function FindIdPage(){

    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [username,setUsername]= useState('');
    const [isError, setIsError] = useState(false);

    const emailRef = useRef();
    const usernameRef = useRef();
    const spanErrorRef = useRef();

    const handleSubmit =e=>{

        e.preventDefault();
        //유효성 체크
        if(emailRef.current.value === '' && usernameRef.current.value ===''){
            spanErrorRef.current.textContent="이름 및 이메일을 모두 입력해주세요";
            return;
        }
        else if(emailRef.current.value === ''){
            spanErrorRef.current.textContent="이메일을 입력해주세요";
            return;
        }
        else{
            spanErrorRef.current.textContent="이름을 입력해주세요";
            return;
        }

        axios

    };

    return<>
        <div className="login-container">
            <h1 className="login-title">아이디 찾기</h1>
            <form className="login-form" onSubmit={handleSubmit}>
                <input 
                    type="text"
                    placeholder="이름 입력"
                    className="login-input"
                    ref={usernameRef}
                    onChange={(e)=> setUsername(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="가입한 이메일"
                    className="login-input"
                    ref={emailRef}
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <button type="submit" className="login-button">
                    아이디 찾기
                </button>
            </form>
            <span ref={spanErrorRef} style={{ color: '#FF0000' }}></span> 
        </div>
        
    
    </>
}

