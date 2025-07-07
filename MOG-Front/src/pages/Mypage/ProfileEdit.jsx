
import { useLocation, useNavigate } from "react-router-dom";
import "./css/profile.css";
import { useRef, useState } from "react";

export default function ProfileEdit(){

    const navigete = useNavigate();

    const {state}=useLocation();
    console.log('state:',state);

    //에러 메시지 뿌리기 위한 Span Ref객체
    const spanNameRef = useRef();
    const spanNicnameRef = useRef();

    const [inputs,setInputs]=useState({
                                        name:state.name,
                                        nicname:state.nicname,
                                        email1:state.email1,
                                        email2:state.email2,
                                        call1:state.call1,
                                        call2:state.call2,
                                        call3:state.call3,
                                        emailDomain:'selected'})
    const {name,nicname,email1,email2,emailDomain,call1,call2,call3}=inputs;
    console.log(inputs);

    const handleChange =e=>{
        const{name,value}=e.target;
        if(name==='name'){
            if(value.trim().length===0)
                spanNameRef.current.textContent='이름을 입력하세요';
            else spanNameRef.current.textContent='';
        }
        else if(name==='nicname'){
            if(value.trim().length===0)
                spanNicnameRef.current.textContent='닉네임을 입력하세요';
            else spanNicnameRef.current.textContent='';
        }

        setInputs(prev=>({...prev,[name]:value}));
    };

    const handleEmail = e=>{
        const value = e.target.value;
        if(value === '4'){
            setInputs((prev=>({...prev, emailDomain:value, email2:''})));
        }
        else{
            setInputs((prev=>({...prev,emailDomain:value, email2:getEmailDomail(value)})));
        }
    }

    const getEmailDomail = (value)=>{
        switch (value){
            case '1':
                return 'naver.com';
            case '2':
                return 'gmail.com';
            case '3':
                return 'hanmail.com';
            default:
                return '';
        }
    }


    const toProfile = e=>{
        e.preventDefault();
        const isLengthName=name.trim().length===0
        const isLengthNickname = nicname.trim().length===0;
        if(isLengthName || isLengthNickname){
            if(isLengthName) spanNameRef.current.textContent='이름은 필수 입력값입니다.';
            if(isLengthNickname) spanNicnameRef.current.textContent='닉네임은 필수 입력값입니다.';
            return;
        }
        navigete('/mypage',{state:{...state,name,nicname,email1,email2,call1,call2,call3}});
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
                            <span className="font-weight-bold fs-2">{state.nicname}</span>
                            <span className="font-weight-bold fs-4">{state.name}</span>
                            <span className="text-black-50">{state.id}</span>
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
                                        <input type="text" className="form-control" placeholder="닉네임을 입력해주세요" name="nicname" value={nicname} onChange={handleChange}/>
                                        <span ref={spanNicnameRef} style={{color:'#FF0000'}}></span>
                                    </div>
                                    <hr className="text-secondary"/>
                                    <div className="profile-id pt-2 ">
                                        <label className="labels">아이디</label>
                                        <input type="text" className="form-control" placeholder="아이디를 입력해주세요" value={state.id} disabled/>
                                    </div>
                                    <hr className="text-secondary"/>
                                    <div className="profile-email pt-2 ">
                                        <label className="labels">E-mail</label>
                                        <div className="d-flex">
                                            <input type="text" className="form-control" placeholder="이메일을 입력해주세요" name="email1" value={email1} onChange={handleChange}/>
                                            <span className="fs-4 mx-1">@</span>
                                            <input type="text" className="form-control" placeholder="직접입력" name="email2" value={email2} onChange={handleChange} disabled={emailDomain!=='4'}/>
                                            <select className="form-select" name="emailDomain" value={emailDomain} onChange={handleEmail} aria-label="Default select example">
                                                <option value='selected'>선택</option>
                                                <option value="1">naver.com</option>
                                                <option value="2">gmail.com</option>
                                                <option value="3">hanmail.net</option>
                                                <option value="4">직접입력</option>
                                            </select>
                                        </div>
                                    </div>
                                    <hr className="text-secondary"/>
                                    <div className="profile-call pt-2">
                                        <label className="labels">전화번호</label>
                                        <div className="d-flex">
                                            <input type="text" className="form-control" placeholder="010" name="call1" value={call1} onChange={handleChange}/>
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
                                <div className="physical-info-height">
                                    <label className="labels">키</label>
                                    <div className="d-flex justify-content-between">
                                        <input type="text" className="form-control" placeholder="키를 입력해주세요" value=""/>
                                        <div className="d-flex flex-column">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="height" id="height-unit1" checked/>
                                                <label className="form-check-label" for="height-unit1">cm</label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="height" id="height-unit2"/>
                                                <label className="form-check-label" for="height-unit2">ft</label>
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                                <hr className="text-secondary"/>
                                <div className="physical-info-height">
                                    <label className="labels">몸무게</label>
                                    <div className="d-flex justify-content-between">
                                        <input type="text" className="form-control" placeholder="몸무게를 입력해주세요" value=""/>
                                        <div className="d-flex flex-column">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="weight" id="weight-unit1" checked/>
                                                <label className="form-check-label" for="weight-unit1">kg</label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="weight" id="weight-unit2"/>
                                                <label className="form-check-label" for="weight-unit2">lb</label>
                                            </div>
                                        </div>
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