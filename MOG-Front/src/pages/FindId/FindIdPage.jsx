import { useRef, useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useModalAlert } from "../../context/ModalAlertContext";

export default function FindIdPage(){
    const {showModal}=useModalAlert();

    const [formData, setFormData]= useState({
        usersName:'',
        phoneNum:''
    });
    const {usersName, phoneNum}=formData;
    const [isUser, setIsUser]=useState(true);
    const [user, setUser]=useState({
        nickName:'',
        email:''
    })
    const phoneNumRef = useRef();
    const usernameRef = useRef();
    const spanErrorRef = useRef();
    const navigate = useNavigate();

    const handleChange =e=>{
        const {name, value}=e.target;
        //제출전에는 유효성체크x
        setFormData(prev=>({...prev,[name]:value}));
    }

    const handleSubmit =e=>{

        e.preventDefault();
        //유효성 체크
        if(phoneNum.trim().length===0 && usersName.trim().length===0){
            spanErrorRef.current.textContent="이름 및 전화번호를 모두 입력해주세요";
            return;
        }
        else if(phoneNum.trim().length===0){
            spanErrorRef.current.textContent="전화번호를 입력해주세요";
            return;
        }
        else if(usersName.trim().length===0){
            spanErrorRef.current.textContent="이름을 입력해주세요";
            return;
        }


        axios.post('http://localhost:8080/api/v1/users/auth/email/find',formData)
            .then(res=>{
                setUser({nickName:res.data.nickName, email:res.data.email});
                setIsUser(false);
            })
            .catch(err=>{
                console.log(err);
                showModal('아이디 찾기에 실패하였습니다.');
            })
    };

    return<>
        <div className="login-container">
            <h1 className="login-title">아이디 찾기</h1>
            {isUser?
            (<form className="login-form" onSubmit={handleSubmit}>
                <input 
                    type="text"
                    placeholder="가입한 이름을 입력해주세요"
                    name="usersName"
                    className="login-input"
                    ref={usernameRef}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    placeholder="가입한 전화번호를 숫자만 입력해주세요"
                    name="phoneNum"
                    className="login-input"
                    ref={phoneNumRef}
                    onChange={handleChange}
                />
                <button type="submit" className="login-button">
                    아이디 찾기
                </button>
            </form>)
            :
            (<div>
                <span className="text-bold fs-4 text-warning">{user.nickName}</span>
                <span className="fs-5">님의 아이디는 </span>
                <span className="text-bold fs-3 text-danger">{user.email}</span>
                <span className="fs-5">입니다.</span>
                <div>
                    <button className="btn btn-warning mt-5" onClick={e=>{
                        e.preventDefault();
                        navigate('/login')}}>로그인페이지로 이동</button>
                </div>
            </div>)}
            <span ref={spanErrorRef} style={{ color: '#FF0000' }}></span> 
        </div>
        
    
    </>
}

