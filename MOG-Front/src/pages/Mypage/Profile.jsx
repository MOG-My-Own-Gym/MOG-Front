import { useFetcher, useLocation, useNavigate, useParams } from "react-router-dom";
import "./css/profile.css";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Login/AuthContext";
export default function Profile(){

    const navigate = useNavigate();
    const {state} = useLocation();
    const {user} = useContext(AuthContext);

    // 초기 프로필 데이터 설정
    const [profile, setProfile] = useState({
        'accessToken':`${user.accessToken}`,
        'name': '',
        'nicname': '',
        'email':`${user.email}`,
        'profileImg':'',
        'call1': '',
        'call2': '',
        'call3': '',
        'age': '',
        'gender':'',
        'height':'',
        'weight': '',
        "regDate": '',
        "password": ''
    });
    console.log(profile.accessToken);

    useEffect(()=>{
        const fetchProfile = async()=>{
            await axios.get('http://localhost:8080/api/v1/users/21')
                        .then(res=>{
                            const getUser = res.data;
                            const getBio = res.data.biosDto;
                            console.log(getUser);
                            console.log(getBio);
                            setProfile(prev=>({...profile, name:getUser.usersName, 
                                                    profileImg:getUser.profileImg,
                                                    age:getBio.age,
                                                    gender:getBio.gender,
                                                    height:getBio.height,
                                                    weight:getBio.weight,
                                                    regDate:getUser.regDate.substring(0,10),
                                                    password:getUser.password
                            }));
                        })
                        .catch(e=>console.log(e.response.data,e));
        };
        fetchProfile();
    },[]);

    console.log(profile);

    return<>
        <div className="container rounded bg-white mb-5">
            <div className="pt-2">
                <div className="row d-flex justify-content-around">
                    <div className="col-md-3 border-right">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                            <img className="rounded-circle mt-5" width="150px" src="/img/userAvatar.png" alt="meaicon - Flaticon 기본이미지"/>
                            <span className="font-weight-bold fs-2">{profile.nicname}</span>
                            <span className="font-weight-bold fs-4">{profile.name}</span>
                            <span className="text-black-50">{profile.email}</span>
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
                                    <div className="profile-email pt-2">
                                        <p>아이디</p>
                                        <h6 className="text-muted">{profile.email}</h6>
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
                                    <hr className="text-secondary"/>
                                    <div className="profile-regDate pt-2">
                                        <p>가입일</p>
                                        <h6 className="text-muted">{profile.regDate}</h6>
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
                                    <p>나이</p>
                                    <span className="text-muted fw-bold">{profile.age}</span>
                                    <span className="text-muted fw-bold" id="unit">세</span>
                                </div>
                                <hr className="text-secondary"/>
                                <div className="physical-info-height">
                                    <p>성별</p>
                                    <span className="text-muted fw-bold">{profile.gender===false?'남자':'여자'}</span>
                                </div>
                                <hr className="text-secondary"/>
                                <div className="physical-info-height">
                                    <p>키</p>
                                    <span className="text-muted fw-bold">{profile.height}</span>
                                    <span className="text-muted fw-bold" id="unit">cm</span>
                                </div>
                                <hr className="text-secondary"/>
                                <div className="physical-info-height">
                                    <p>몸무게</p>
                                    <span className="text-muted fw-bold">{profile.weight}</span>
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