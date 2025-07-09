import { useState } from "react";
import './SignUp.css'

export default function SignUp(){
    const [formData, setFormData]=useState({
        name:'',
        nickname:'',
        username:'',
        email:'',
        password:'',
        confirmPassword:"",
        phone:'',
        address:'',
        height:'',
        weight:''
    });

    const [idCheckResult, setIdCheckResult]= useState('');
    const [emailCheckResult, setEmailCheckResult]=useState('');


    const handleChange =(e)=>{
        const {name,value} = e.target;
        setFormData((prev)=>({...prev,[name]:value}));
    };
    const handleSubmit=(e)=>{
        e.preventDefault();
        if(formData.password !== formData.confirmPassword){
            alert('비밀번호가 일치하지 않습니다');
            return;
        }
        console.log('회원가입 데이터:',formData);
        //API 요청 자리?
    };
    
    const handleCheckUsername=()=>{
        console.log('아이디 중복 확인 요청:',formData.username);
        //axios요청 자리?
        setIdCheckResult('사용 가능한 아이디입니다');
    }


    const handleCheckEmail=()=>{
        console.log('이메일 중복 확인 요청:', formData.email);
        //axios요청 자리?
        setEmailCheckResult('이미 사용 중인 이메일입니다');
    }

    return<>
    <div className="signup-container">
        <h1 className="signup-title">회원가입</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
            {/**필수항목 */}
            <label>이름</label>
            <input name="name" placeholder="이름" required onChange={handleChange}/>
            
            <div className="row-2col">
                <div>
                <label>닉네임</label>
                <input name="nickname" placeholder="닉네임" required onChange={handleChange}/>
            </div>
            <div>
                <label>아이디</label>
                <div className="check-row">
                <input name="username" required onChange={handleChange}/>
                <button type="button" className="check-btn" onClick={handleCheckUsername}>중복확인</button>
            </div>
            </div>
            </div>
            <label>E-mail</label>
            <input name="email" type="email" placeholder="이메일" required onChange={handleChange}/>
            <label>비밀번호</label>
            <input name="password" type="password" placeholder="비밀번호" required onChange={handleChange}/>
            <label>비밀번호 확인</label>
            <input name="confirmPassword" type="password" placeholder="비밀번호 확인" required onChange={handleChange} />
            <label>핸드폰 번호</label>
            <input name="phone" type="tel" placeholder="전화번호" required onChange={handleChange}/>
           {/*선택 항목세션? */}
           <div className="signup-section">
            <div className="signup-section-title">선택 정보</div>
            <label>주소</label>
            <input name="address" placeholder="주소 (선택)" onChange={handleChange}/>
            
            <div className="row-2col">
            <div>
            <label>키</label>
            <input name="height" type="number" placeholder="키 (선택,cm)" onChange={handleChange}/>
             </div>
             <div>
            <label>몸무게</label>
            <input name="weight" type="number" placeholder="몸무게 (선택,kg)" onChange={handleChange}/>
            </div>
           </div>
           </div>

            <button type="submit" className="signup-button">회원가입</button>
        </form>
    </div>
    
    </>
}