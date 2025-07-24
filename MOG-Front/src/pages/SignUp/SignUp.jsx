import { useRef, useState } from "react";
import './SignUp.css'
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignUp(){
    const navigator = useNavigate();
    const [formData, setFormData]=useState({
        name:'',
        nickname:'',
        email:'',
        password:'',
        confirmPassword:'',
        phoneNum:'',
        age:'',
        gender:'',
        height:'',
        weight:''
    });
    const {name,nickname,email,password,confirmPassword,phoneNum,age,gender,height,weight}=formData;

    const checkEmailRef=useRef();
    const checkNameRef=useRef();
    const checkNicknameRef=useRef();
    const checkPasswordRef=useRef();
    const passwordCheckResult=useRef();
    const emailCheckResult=useRef();
    const emailRef=useRef();
    const passwordRef=useRef();
    const checkCallRef=useRef();

  const handleChange = e => {
    const { name, value } = e.target;
    //유효성 체크
    if (name === 'email')
      checkEmailRef.current.textContent = value.trim() === '' ? '이메일을 입력하세요' : '';
    else if (name === 'name')
      checkNameRef.current.textContent = value.trim() === '' ? '이름을 입력하세요' : '';
    else if (name === 'nickname')
      checkNicknameRef.current.textContent = value.trim() === '' ? '닉네임을 입력하세요' : '';
    else if (name === 'password')
      checkPasswordRef.current.textContent = value.trim() === '' ? '비밀번호를 입력하세요' : '';
    else if (name === 'phoneNum')
      checkCallRef.current.textContent = value.trim() === '' ? '전화번호를 입력하세요' : '';

        //비밀번호 확인
        if(name==='confirmPassword'){
            if(value === passwordRef.current.value){
                passwordCheckResult.current.textContent = value.trim()===''?'':'비밀번호 일치';
                setFormData(prev=>({...prev,confirmPassword:value}));
            }
            else if(value !== passwordRef.current.value) {
                passwordCheckResult.current.textContent = value.trim()===''?'':'비밀번호가 일치하지 않습니다';
            }
        }
        else if(name === 'gender'){
            if(value=== 'true') setFormData(prev=>({...prev,gender:true}));
            else setFormData(prev=>({...prev,gender:false}));
        }
        else setFormData(prev=>({...prev,[name]:value}));
    };

    const handleSubmit=(e)=>{
        e.preventDefault();
        //유효성 체크
        if(email.trim().length===0 ||
            nickname.trim().length===0 || 
            name.trim().length===0 ||
            password.trim().length===0 ||
            phoneNum.trim().length===0
            ){
                window.alert('필수 항목(*)은 반드시 입력해 주세요');
                return;
        }
        if(emailCheckResult.current.textContent.trim()===''){
            window.alert('아이디의 중복여부를 확인해 주세요')
            emailRef.current.focus();
            return;
        }
        if(confirmPassword.trim().length===0){
            window.alert('비밀번호가 일치하지 않습니다.')
            document.querySelector('input[name="confirmPassword"]').focus();
            return;
        }
        
        axios.post('http://localhost:8080/api/v1/users/signup',
            {
                usersName:name,
                email:email,
                profileImg:"/img/userAvatar.png",
                nickName:nickname,
                phoneNum:phoneNum,
                biosDto:{
                    gender:gender,
                    age:age,
                    height:height,
                    weight:weight
                },
                authDto:{
                    password:confirmPassword
                }
            })
            .then(resp=>{
                console.log(resp.data);
                window.alert('회원가입 완료');
                navigator('/login');
            })
            .catch(err=>{
              console.log(err)
              window.alert('회원가입 실패');
            });
    };
    
    const handleCheckEmail=(e)=>{
        e.preventDefault();
        axios.get(`http://localhost:8080/api/v1/users/list`)
        .then(res=>{
            console.log(res);
            const users=res.data;
            const findUser = users.findIndex(user=>user.email === emailRef.current.value);
            if(findUser!==-1) {
                emailCheckResult.current.textContent='이미 존재하는 아이디 입니다';
                emailRef.current.value='';
                emailRef.current.focus();
            }
            else emailCheckResult.current.textContent='사용 가능한 아이디입니다';
        })
        .catch(err=>{
            console.log(err);
        })
    }

    return<>
        <div className="signup-container">
            <h1 className="signup-title">회원가입</h1>
            <form className="signup-form" onSubmit={handleSubmit}>
                <div>
                    {/**필수항목 */}
                    <div>
                        <div>
                            <label>아이디</label>
                            <span className="text-danger fs-5 mx-2">*</span>
                            <span ref={emailCheckResult} style={{color:'#0000FF'}}></span>
                            <div className="check-row">
                                <input ref={emailRef} className="form-control" type="email" name="email" placeholder="이메일" onChange={handleChange}/>
                                <button type="button" className="check-btn" onClick={handleCheckEmail}>중복확인</button>
                            </div>
                            <span ref={checkEmailRef} style={{color:'#FF0000'}}></span>
                        </div>
                        <div>
                            <label>이름</label>
                            <span className="text-danger fs-5 mx-2">*</span>
                            <input className="form-control" name="name" placeholder="이름" onChange={handleChange}/>
                            <span ref={checkNameRef} style={{color:'#FF0000'}}></span>
                        </div>
                        <div>
                            <label>닉네임</label>
                            <span className="text-danger fs-5 mx-2">*</span>
                            <input className="form-control" name="nickname" placeholder="닉네임" onChange={handleChange}/>
                            <span ref={checkNicknameRef} style={{color:'#FF0000'}}></span>
                        </div>
                        <div>
                            <label>비밀번호</label>
                            <span className="text-danger fs-5 mx-2">*</span>
                            <input ref={passwordRef} className="form-control" name="password" type="password" placeholder="비밀번호" onChange={handleChange}/>
                            <span ref={checkPasswordRef} style={{color:'#FF0000'}}></span>
                        </div>
                        <div>
                            <label>비밀번호 확인</label>
                            <span className="text-danger fs-5 mx-2">*</span>
                            <input className="form-control" name="confirmPassword" type="password" placeholder="비밀번호 확인" onChange={handleChange} />
                            <span ref={passwordCheckResult} style={{color:'#0000FF'}}></span>
                        </div>
                        <div>
                            <label>전화번호</label>
                            <span className="text-danger fs-5 mx-2">*</span>
                            <input className="form-control" name="phoneNum" type="number" placeholder="전화번호 (-을 제외한 숫자만 입력해 주세요)" onChange={handleChange} />
                            <span ref={checkCallRef} style={{color:'#FF0000'}}></span>
                        </div>
                    </div>

            {/*선택 항목세션? */}
            <hr className="mt-4" />
            <div className="signup-section-title">선택 정보</div>
            <div>
              <label>성별</label>
              <div className="d-flex flex-column">
                <div className="form-check d-flex flex-row">
                  <input
                    className="mx-3"
                    type="radio"
                    name="gender"
                    value="false"
                    onChange={handleChange}
                  />
                  <label htmlFor="male">남자</label>
                </div>
                <div className="form-check d-flex flex-row">
                  <input
                    className="mx-3"
                    type="radio"
                    name="gender"
                    value="true"
                    onChange={handleChange}
                  />
                  <label htmlFor="female">여자</label>
                </div>
              </div>
            </div>
            <div className="d-flex flex-column">
              <label>나이</label>
              <input
                className="col-6"
                name="age"
                type="number"
                placeholder="나이 (선택)"
                onChange={handleChange}
              />

              <label>키</label>
              <div>
                <input name="height" type="number" placeholder="키 (cm)" onChange={handleChange} />
                <span className="mx-2">cm</span>
              </div>

              <label>몸무게</label>
              <div>
                <input
                  name="weight"
                  type="number"
                  placeholder="몸무게 (kg)"
                  onChange={handleChange}
                />
                <span className="mx-2">kg</span>
              </div>
            </div>
            <div className="d-flex justify-content-center pt-5">
              <button type="submit" className="signup-button">
                회원가입
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
}
