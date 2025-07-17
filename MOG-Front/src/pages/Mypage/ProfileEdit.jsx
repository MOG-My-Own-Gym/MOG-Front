
import { useLocation, useNavigate } from "react-router-dom";
import "./css/profile.css";
import { useRef, useState } from "react";
import axios from "axios";


export default function ProfileEdit(){

    const navigete = useNavigate();

    const { state }=useLocation();
    console.log('state:',state);

    //에러 메시지 뿌리기 위한 Span Ref객체
    const spanNameRef = useRef();
    const spanNicknameRef = useRef();

    const [inputs,setInputs]=useState({
                                        name:state.name,
                                        nickName:state.nickName,
                                        call1:state.call.split('-')[0],
                                        call2:state.call.split('-')[1],
                                        call3:state.call.split('-')[2],
                                        age:state.age,
                                        gender:state.gender,
                                        height:state.height,
                                        weight:state.weight
                                    })
    const {name,nickName,call1,call2,call3,age,gender,height,weight}=inputs;
    console.log(inputs);

    const handleChange =e=>{

        const{name,value}=e.target;
        //유효성 검증
        if(name==='name'){
            spanNameRef.current.textContent = value.trim() === '' ? '이름을 입력하세요' : '';
        }
        else if(name==='nickName'){
            spanNicknameRef.current.textContent = value.trim() === '' ? '닉네임을 입력하세요' : '';
        }

        if(name === 'gender'){
            if(value=== 'true') setInputs(prev=>({...prev,gender:true}));
            else setInputs(prev=>({...prev,gender:false}));
        }
        else setInputs(prev=>({...prev,[name]:value}));
    };

    const toProfile = e=>{
        e.preventDefault();
        const isLengthName=name.trim().length===0
        const isLengthNickname = nickName.trim().length===0;
        if(isLengthName || isLengthNickname){
            if(isLengthName) spanNameRef.current.textContent='이름은 필수 입력값입니다.';
            if(isLengthNickname) spanNicknameRef.current.textContent='닉네임은 필수 입력값입니다.';
            return;
        }
        console.log(state)
        axios.put(`http://localhost:8080/api/v1/users/update/${state.usersId}`,
            {
                usersName:name,
                nickName:nickName,
                email:state.email,
                profileImg:state.profileImg,
                biosDto:{
                        gender:gender,
                        age:age,
                        height:height,
                        weight:weight
                },
                authDto:{password:state.password}
            },
            {withCredentials:true,
                headers: {
                  Authorization: `Bearer ${state.accessToken}`
                }
            })
            .then(res=>{
                console.log(res);
                navigete('/mypage');
            })
            .catch(e=>console.log(e));
    };
    
    
    return<>
        <div className="container rounded bg-white mt-5 mb-5">
            <div className="pt-2">
                <div className="row d-flex justify-content-around">
                    <div className="col-md-3 border-right">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                        <img className="rounded-circle mt-5" width="150px" src="/img/userAvatar.png" alt="meaicon - Flaticon 기본이미지"/>
                        <div className="mb-3">
                            <label className="form-label text-muted">프로필 사진 수정</label>
                            <input className="form-control form-control-sm" id="formFileSm" type="file"/>
                        </div>
                            <span className="font-weight-bold fs-2">{state.nickName}</span>
                            <span className="font-weight-bold fs-4">{state.name}</span>
                            <span className="text-black-50">{state.email}</span>
                        </div>
                    </div>
                    <div className="col-md-5 border-right">
                        <div className="p-3 py-5">
                            <div className="row mt-2">
                                <fieldset className="border rounded-3 p-3 profile-info col-md-12">
                                    <legend className="float-none w-auto px-3">Profile</legend>
                                    <div className="profile-name ">
                                        <label className="labels">이름</label><span className="text-danger">*</span>
                                        <input type="text" className="form-control" placeholder="이름을 입력해주세요" name="name" value={name} onChange={handleChange}/>
                                        <span ref={spanNameRef} style={{color:'#FF0000'}}></span>
                                    </div>
                                    <hr className="text-secondary"/>
                                    <div className="profile-nickname pt-2 ">
                                        <label className="labels">닉네임</label><span className="text-danger">*</span>
                                        <input type="text" className="form-control" placeholder="닉네임을 입력해주세요" name="nickname" value={nickName} onChange={handleChange}/>
                                        <span ref={spanNicknameRef} style={{color:'#FF0000'}}></span>
                                    </div>
                                    <hr className="text-secondary"/>
                                    <div className="profile-id pt-2 ">
                                        <label className="labels">아이디</label>
                                        <input type="text" className="form-control" placeholder="아이디를 입력해주세요" value={state.email} disabled/>
                                    </div>
                                    <hr className="text-secondary"/>
                                    <div className="profile-call pt-2">
                                        <label className="labels">전화번호</label>
                                        <div className="d-flex">
                                            <input type="text" className="form-control" placeholder="전화번호를 입력해주세요" name="call1" id="call1" value={call1} onChange={handleChange}/>
                                            <span className="fs-4 mx-1">-</span>
                                            <input type="text" className="form-control" placeholder="전화번호를 입력해주세요" name="call2" value={call2} onChange={handleChange}/>
                                            <span className="fs-4 mx-1">-</span>
                                            <input type="text" className="form-control" placeholder="전화번호를 입력해주세요" name="call3" value={call3} onChange={handleChange}/>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 py-5">
                            <fieldset className="border rounded-3 p-3 body-info">
                                <legend className="float-none w-auto px-3">신체 정보</legend>
                                <div className="physical-info-age">
                                    <label className="labels">나이</label>
                                    <div className="d-flex justify-content-between">
                                        <input type="text" className="form-control" placeholder="나이를 입력해주세요" name="age" value={age} onChange={handleChange}/>
                                        <span className="fs-5 mx-1">세</span>
                                    </div>
                                </div> 
                                <hr className="text-secondary"/>
                                <div className="physical-info-gender">
                                    <label className="labels">성별</label>
                                    <div className="d-flex justify-content-around">
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="gender" value="false" checked={gender=== false} onChange={handleChange}/>
                                            <label className="form-check-label" htmlFor="male">남자</label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="gender" value="true" checked={gender === true} onChange={handleChange}/>
                                            <label className="form-check-label" htmlFor="female">여자</label>
                                        </div>
                                    </div>
                                </div>
                                <hr className="text-secondary"/>
                                <div className="physical-info-height">
                                    <label className="labels">키</label>
                                    <div className="d-flex justify-content-between">
                                        <input type="text" className="form-control" placeholder="키를 입력해주세요" name="height" value={height} onChange={handleChange}/>
                                        <span className="fs-5 mx-1">cm</span>
                                    </div>
                                </div> 
                                <hr className="text-secondary"/>
                                <div className="physical-info-height">
                                    <label className="labels">몸무게</label>
                                    <div className="d-flex justify-content-between">
                                        <input type="text" className="form-control" placeholder="몸무게를 입력해주세요" name='weight' value={weight} onChange={handleChange}/>
                                        <span className="fs-5 mx-1">kg</span>
                                    </div>
                                </div> 
                            </fieldset>
                        </div>
                        <div className="text-center">
                            <button onClick={toProfile} className="btn btn-warning profile-button" type="submit">
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    </>
}