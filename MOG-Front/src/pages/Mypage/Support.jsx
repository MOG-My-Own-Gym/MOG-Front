import { useContext, useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Login/AuthContext";
import axios from "axios";

export default function Support(){

    const navigate=useNavigate();
    const { user, dispatch } = useContext(AuthContext);
    let userProfile=null;
    const location = useLocation();
    let currentPath = location.pathname;

    const cardActive =()=>{
        const [isActive, setIsActive] = useState(false);

        if(currentPath === '/mypage/support') setIsActive(!isActive);

        return <>
            <li className="nav-item">
                {isActive?
                (<Link aria-current="true" to="/mypage/support" className="nav-link active">비밀번호 변경</Link>)
                :
                (<Link aria-current="false" to="/mypage/support" className="nav-link">비밀번호 변경</Link>)
                }
            </li>
            <li className="nav-item">
                {isActive?
                (<Link aria-current="false" to="/mypage/support/withdrawal" className="nav-link">회원 탈퇴</Link>)
                :
                (<Link aria-current="true" to="/mypage/support/withdrawal" className="nav-link active">회원 탈퇴</Link>)
                }
            </li>  
        </>
    };

    useEffect(()=>{
        axios.get(`http://localhost:8080/api/v1/users/${user.usersId}`)
            .then(res=>{
                userProfile=res.data;
            })
            .catch(err=>console.log(err));
    },[])

    const UpdatePassword=()=>{

        const [passwords, setPasswords]=useState({
            exPassword:'',
            newPassword:'',
            newPasswordCheck:''
        });
        const {exPassword,newPassword,newPasswordCheck}=passwords;
        
        const exPasswordRef = useRef();
        const newPasswordRef=useRef();
        const checkPasswordRef=useRef();

        const handleChange=e=>{
            const {name,value}=e.target;
            if(name==='newPasswordCheck'){
                const checkPassword = document.querySelector('#newPassword').value.trim();
                if(value === checkPassword){
                    checkPasswordRef.current.textContent = value.trim()===''?'':'비밀번호 일치';
                    setPasswords(prev=>({...prev,newPasswordCheck:value}));
                }
                else if(value !== checkPassword) {
                    checkPasswordRef.current.textContent = value.trim()===''?'':'비밀번호가 일치하지 않습니다';
                }
            }
            else setPasswords(prev=>({...prev,[name]:value}));
        };

        const handleClick=e=>{
            e.preventDefault();
            //유효성 체크
            if(exPassword.trim().length===0) {
                exPasswordRef.current.textContent='현재 비밀번호를 입력해주세요';
                document.querySelector('#exPassword').focus();
                return;
            }
            if(newPassword.trim().length===0){
                newPasswordRef.current.textContent='새 비밀번호를 입력해주세요';
                document.querySelector('#newPassword').focus();
                return;
            }

            if(exPassword!==userProfile.authDto.password){
                window.alert('현재 비밀번호가 일치하지 않습니다');
                document.querySelector('#exPassword').focus();
                return;
            }
            if(newPasswordCheck.trim().length===0){
                window.alert('새 비밀번호가 일치하지 않습니다');
                document.querySelector('#newPasswordCheck').focus();
                return;
            }

            axios.put(`http://localhost:8080/api/v1/users/update/${user.usersId}`,
                {...userProfile,
                    authDto:{password:newPasswordCheck}
                },
                {withCredentials:true,
                    headers: {
                    Authorization: `Bearer ${user.accessToken}`
                    }
            })
            .then(res=>{
                console.log(res.data);
                window.alert('비밀번호가 변경되었습니다');
                navigate('/support');
            })
            .catch(err=>console.log(err));
        }

        return<>
            <div>
                <div>
                    <label>현재 비밀번호</label>
                    <input id="exPassword" type="password" className="form-control" placeholder="현재 비밀번호" name="exPassword" onChange={handleChange}/>
                    <span ref={exPasswordRef} style={{color:'#FF0000'}}></span>
                </div>
                <hr className="my-3"/>
                <div>
                    <label>새 비밀번호</label>
                    <input id="newPassword" type="password" className="form-control" placeholder="새 비밀번호" name="newPassword" onChange={handleChange}/>
                    <span ref={newPasswordRef} style={{color:'#FF0000'}}></span>
                </div>
                <div className="pt-3">
                    <label>새 비밀번호 확인</label>
                    <input id="newPasswordCheck" type="password" className="form-control" placeholder="새 비밀번호" name="newPasswordCheck" onChange={handleChange}/>
                    <span ref={checkPasswordRef} style={{color:'#0000FF'}}></span>
                </div>
                <div className="d-flex justify-content-center">
                    <button className="btn btn-warning mt-5" onClick={handleClick}>확인</button>
                </div>
            </div>

        </>
    };
    
    const WithdrawalUser=()=>{
        
        const passwordRef=useRef();
        let password='';

        const handleChange=e=>{
            if(e.target.value==='') passwordRef.current.textContent='';
            else{
                if(e.target.value===userProfile.authDto.password) {
                    passwordRef.current.textContent='';
                    password=e.target.value;
                }
                else {
                    passwordRef.current.textContent='비밀번호가 일치하지 않습니다';
                    password='';
                }
            }
        };

        const handleClick=e=>{
            e.preventDefault();
            if(password!==''){
                if(window.confirm('정말로 탈퇴하시겠습니까?')){
                    axios.delete(`http://localhost:8080/api/v1/users/delete/${user.usersId}`)
                        .then(res=>{
                            console.log(res);
                            window.alert('탈퇴되었습니다');
                            dispatch({type:'LOGOUT'});
                            navigate('/');
                        })
                        .catch(err=>console.log(err));
                }
                else{
                    window.alert('취소되었습니다');
                }
            }
        }

        return<>
            <div>
                <div>
                    <label>현재 비밀번호</label>
                    <input type="password" className="form-control" placeholder="현재 비밀번호" name="password" onChange={handleChange}/>
                    <span ref={passwordRef} style={{color:'#FF0000'}}></span>
                </div>
                <div className="d-flex justify-content-center">
                    <button className="btn btn-warning mt-5" onClick={handleClick}>회원 탈퇴</button>
                </div>
            </div>
        </>
    };

    return<>
        <div className="container">
            <div className="container-fluid d-flex">
                <div className="card w-100 h-100">
                    <div className="card-header text-center">
                        <ul className="nav nav-tabs card-header-tabs">
                            <cardActive/>
                        </ul>
                    </div>
                    <div className="card-body p-4">
                        <Routes>
                            <Route path="" element={<UpdatePassword/>}></Route>
                            <Route path="/withdrawal" element={<WithdrawalUser/>}></Route>
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    </>
}