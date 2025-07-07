import { useLocation, useNavigate } from "react-router-dom";
import "./css/profile.css";
import { useContext, useEffect, useState } from "react";
export default function Profile(){

    const navigate = useNavigate();
    const {state} = useLocation();

    const users = [
        { 
            name:"김길동",
            nicname:"길동05",
            id: 'gildonga123',
            password: 'kim1234',
            email:"gildong@gmail.com",
            call:"010-1111-1111"
        }
    ];

    useEffect(() => {
        //사용자의 id와 password를 세션에 저장
        if (users && users.length > 0) {
          const user = users[0];  // 첫 번째 사용자를 예시로 선택
          sessionStorage.setItem('userId', user.id);
          sessionStorage.setItem('userPassword', user.password);
        }
    }, []);

    // 초기 프로필 데이터 설정
    const [profile, setProfile] = useState({
        'name': `${users[0].name}`,
        'nicname': `${users[0].nicname}`,
        'id':`${users[0].id}`,
        'email1': '',
        'email2': '',
        'call1': '',
        'call2': '',
        'call3': ''
    });

    useEffect(()=>{
        if(state){
            setProfile(state);
        }
    },[state]);

    

    return<>
        <div className="container rounded bg-white mt-5 mb-5">
            <div className="pt-2">
                <div className="row d-flex justify-content-around">
                    <div className="col-md-3 border-right">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                            <img className="rounded-circle mt-5" width="150px" src="/img/userAvatar.png" alt="meaicon - Flaticon 기본이미지"/>
                            <span className="font-weight-bold fs-2">{profile.nicname}</span>
                            <span className="font-weight-bold fs-4">{profile.name}</span>
                            <span className="text-black-50">{profile.id}</span>
                        </div>
                    </div>
                    <div className="col-md-4 border-right">
                        <div className="p-3 py-5">
                            <div className="row mt-2">
                                <fieldset className="border rounded-3 p-3 col-md-12 profile-info">
                                    <legend className="float-none w-auto px-3">Profile</legend>
                                    <div className="profile-name">
                                        <h6 className="text-primary fs-1 profile-name">{profile.name}</h6>
                                    </div>
                                    <hr className="text-secondary"/>
                                    <div className="profile-nickname pt-2">
                                        <p>닉네임</p>
                                        <h6 className="text-muted">{profile.nicname}</h6>
                                    </div>
                                    <hr className="text-secondary"/>
                                    <div className="profile-id pt-2">
                                        <p>아이디</p>
                                        <h6 className="text-muted">{profile.id}</h6>
                                    </div>
                                    <hr className="text-secondary"/>
                                    <div className="profile-email pt-2">
                                        <p>E-mail</p>
                                        {
                                            profile.email1 !== ''?
                                            <h6 className="text-muted">{profile.email1}@{profile.email2}</h6>:
                                            <h6 className="text-muted">이메일 정보가 없습니다.</h6>
                                        }
                                    </div>
                                    <hr className="text-secondary"/>
                                    <div className="profile-call pt-2">
                                        <p>전화번호</p>
                                        {
                                            profile.call1!==''?
                                            <h6 className="text-muted">{profile.call1}-{profile.call2}-{profile.call3}</h6>:
                                            <h6 className="text-muted">전화번호 정보가 없습니다.</h6>
                                        }
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 py-5">
                            <fieldset className="border rounded-3 p-3 body-info">
                                <legend className="float-none w-auto px-3">신체 정보</legend>
                                <div className="physical-info-height">
                                    <p>키</p>
                                    <span className="text-muted fw-bold">175</span>
                                    <span className="text-muted fw-bold" id="unit">cm</span>
                                </div>
                                <hr className="text-secondary"/>
                                <div className="physical-info-height">
                                    <p>몸무게</p>
                                    <span className="text-muted fw-bold">70</span>
                                    <span className="text-muted fw-bold" id="unit">kg</span>
                                </div>
                            </fieldset>
                        </div>
                        <div className="mt-5 text-center">
                            <button onClick={()=>navigate('/mypage/edit',{state:profile})} className="btn btn-warning profile-button" type="button">
                                프로필 수정
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>



    
    </>
}