import { useNavigate } from "react-router-dom";
import "./css/profile.css";
export default function Profile(){

    const navigate = useNavigate();
    const toEdit = ()=>{
        navigate('/mypage/edit');
    };

    return<>
        <div className="container rounded bg-white mt-5 mb-5">
            <div className="pt-2">
                <div className="row d-flex justify-content-around">
                    <div className="col-md-3 border-right">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                            <img className="rounded-circle mt-5" width="150px" src="/img/userAvatar.png" alt="meaicon - Flaticon 기본이미지"/>
                            <span className="font-weight-bold fs-2">길동05</span>
                            <span className="font-weight-bold fs-4">가길동</span>
                            <span className="text-black-50">gagildong@gmail.com</span>
                        </div>
                    </div>
                    <div className="col-md-4 border-right">
                        <div className="p-3 py-5">
                            <div className="row mt-2">
                                <fieldset className="border rounded-3 p-3 col-md-12 profile-info">
                                    <legend className="float-none w-auto px-3">Profile</legend>
                                    <div className="profile-name">
                                        <h6 className="text-primary fs-1 profile-name">가길동</h6>
                                    </div>
                                    <hr className="text-secondary"/>
                                    <div className="profile-nickname pt-2">
                                        <p>닉네임</p>
                                        <h6 className="text-muted">길동05</h6>
                                    </div>
                                    <hr className="text-secondary"/>
                                    <div className="profile-id pt-2">
                                        <p>아이디</p>
                                        <h6 className="text-muted">gildongGa1234</h6>
                                    </div>
                                    <hr className="text-secondary"/>
                                    <div className="profile-email pt-2">
                                        <p>E-mail</p>
                                        <h6 className="text-muted">gagildong@gmail.com</h6>
                                    </div>
                                    <hr className="text-secondary"/>
                                    <div className="profile-call pt-2">
                                        <p>전화번호</p>
                                        <h6 className="text-muted">010-1111-1111</h6>
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
                            <button onClick={toEdit} className="btn btn-warning profile-button" type="button">
                                프로필 수정
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>



    
    </>
}