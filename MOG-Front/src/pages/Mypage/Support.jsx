import { useContext, useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Login/AuthContext";
import axios from "axios";
import { useModalAlert } from "../../context/ModalAlertContext";

export default function Support(){
    const {showModal}=useModalAlert();

    const navigate=useNavigate();
    const { user, dispatch } = useContext(AuthContext);
    const location = useLocation();
    let currentPath = location.pathname;

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

            if(newPasswordCheck.trim().length===0){
                showModal('새 비밀번호가 일치하지 않습니다');
                document.querySelector('#newPasswordCheck').focus();
                return;
            }

            async function fetchPassword() {
                try {
                    const res1 = await axios.post('http://localhost:8080/api/v1/users/auth/password/check',
                        {password:exPassword},
                        {   withCredentials: true,
                            headers: { Authorization: `Bearer ${user.accessToken}`},
                        },
                    );
                    console.log('비밀번호 확인 성공:', res1.data);
                } catch (err1) {
                    console.log('첫 번째 호출 오류 발생:', err1);
                    showModal('현재 비밀번호가 일치하지 않습니다');
                    return;
                }

                try {
                    const res2 = await axios.put('http://localhost:8080/api/v1/users/auth/password/update',
                        {
                            originPassword:exPassword,
                            newPassword:newPasswordCheck
                        },
                        {
                            withCredentials:true,
                            headers: {
                            Authorization: `Bearer ${user.accessToken}`
                        }}
                    );
                    console.log('비밀번호 변경 성공:', res2.data);
                    showModal('비밀번호가 변경되었습니다');
                    navigate('/mypage/support');
                } catch (err2) {
                    console.log('두 번째 호출 오류 발생:', err2);
                    showModal('비밀번호 변경에 실패하였습니다');
                }
            }
            fetchPassword();
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

        const handleChange=e=>{
            if(e.target.value==='') passwordRef.current.textContent='';
        };

        const handleClick=e=>{
            e.preventDefault();
            let res1='';
            async function fetchWithdrawal() {
                try {
                    res1 = await axios.post('http://localhost:8080/api/v1/users/auth/password/check',
                        {password:document.querySelector('#currentPassword').value},
                        {   withCredentials: true,
                            headers: { Authorization: `Bearer ${user.accessToken}`},
                        }
                    );
                    console.log('비밀번호 확인 성공:', res1.data);

                } catch (err1) {
                    console.log('첫 번째 호출 오류 발생:', err1);
                    showModal('현재 비밀번호가 일치하지 않습니다');
                    return;
                }

                const confirmWithdrawal = confirm('정말 탈퇴하시겠습니까?');

                if(confirmWithdrawal){
                    try {
                        const res2 = await axios.delete(`http://localhost:8080/api/v1/users/delete/${res1.data.usersId}`,
                            {
                                withCredentials:true,
                                headers: {
                                Authorization: `Bearer ${user.accessToken}`
                            }}
                        );
                        console.log('회원탈퇴 성공:', res2.data);
                        showModal('탈퇴되었습니다');
                        dispatch({type:'LOGOUT'});
                        navigate('/');

                    } catch (err2) {
                        console.log('두 번째 호출 오류 발생:', err2);
                        showModal('회원탈퇴에 실패하였습니다');
                    }
                }
                else showModal('회원탈퇴가 취소되었습니다');
            }
            fetchWithdrawal();
        }

        return<>
            <div>
                <div>
                    <label>현재 비밀번호</label>
                    <input id="currentPassword" type="password" className="form-control" placeholder="현재 비밀번호" name="password" onChange={handleChange}/>
                    <span ref={passwordRef} style={{color:'#FF0000'}}></span>
                </div>
                <div className="d-flex justify-content-center">
                    <button className="btn btn-warning mt-5" onClick={handleClick}>회원 탈퇴</button>
                </div>
            </div>
        </>
    };

    const CardActive =()=>{
        const [isActive, setIsActive] = useState(false);
        useEffect(()=>{
            if(currentPath === '/mypage/support') setIsActive(!isActive);
        },[])

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

    return<>
        <div className="container pt-5">
            <div className="container-fluid d-flex">
                <div className="card w-100 h-100">
                    <div className="card-header text-center">
                        <ul className="nav nav-tabs card-header-tabs">
                        <CardActive/>
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