import { Link, Route, Routes, useLocation } from "react-router-dom";
import "./css/mypage.css";
import Profile from "./Profile";
import MyRoutine from "./MyRoutine";
import MySocial from "./MySocial";
import Settings from "./Settings";
import Support from "./Support";
import ProfileEdit from "./ProfileEdit";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../Login/AuthContext";

export default function MyPage(){
    const { user } = useContext(AuthContext);
    const [userName, setUserName] = useState('');
    const location = useLocation();

    const isPathMatch = pathname =>{
        return location.pathname === pathname;
    };

    useEffect(()=>{
        axios.get(`http://localhost:8080/api/v1/users/${user.usersId}`)
            .then(res=>{
                setUserName(res.data.nickName);
            })
            .catch(err=>console.log(err));
    },[]);

    return<>
        <div className="d-flex">
            <div className="col-auto">
                {/*사이드바 시작 */}
                <div className="sidebar d-flex flex-column col-auto justify-content-between bg-black text-white px-3 h-100">
                    <div>
                        <ul className="nav nav-pills-mypage flex-column px-0">
                            <li className="nav-item fs-4 my-1 py-2 py-sm-0 mt-4">
                                <Link to="/mypage" className={isPathMatch('/mypage') || isPathMatch('/mypage/edit') ? "nav-link text-white px-2 fs-5 active-link" : "nav-link text-white px-2 fs-5"}>
                                    <i className="fa-solid fa-circle-user me-3 ps-sm-0 ps-3"></i>
                                    <span className='d-none d-sm-inline'>프로필</span>
                                </Link>
                            </li>
                            <hr className="text-secondary d-none d-sm-block"/>
                            <li className="nav-item fs-4 my-1 py-2 py-sm-0 mt-4">
                                <Link to="/mypage/myroutine" className={isPathMatch('/mypage/myroutine') ? "nav-link text-white px-2 fs-5 active-link" : "nav-link text-white px-2 fs-5"}>
                                    <i className="fa-solid fa-dumbbell me-3 ps-sm-0 ps-3"></i>
                                    <span className='d-none d-sm-inline'>나의 루틴</span>
                                </Link>
                            </li>
                            <li className="nav-item fs-4 my-1 py-2 py-sm-0 mt-4">
                                <Link to="/mypage/mysocial" className={isPathMatch('/mypage/mysocial') ? "nav-link text-white px-2 fs-5 active-link" : "nav-link text-white px-2 fs-5"}>
                                    <i className="fa-solid fa-image me-3 ps-sm-0 ps-3"></i>
                                    <span className='d-none d-sm-inline'>나의 소셜</span>
                                </Link>
                            </li>
                            <hr className="text-secondary d-none d-sm-block"/>
                            <li className="nav-item fs-4 my-1 py-2 py-sm-0 mt-4">
                                <Link to="/mypage/settings" className={isPathMatch('/mypage/settings') ? "nav-link text-white px-2 fs-5 active-link" : "nav-link text-white px-2 fs-5"}>
                                    <i className="fa-solid fa-gear me-3 ps-sm-0 ps-3"></i>
                                    <span className='d-none d-sm-inline'>환경설정</span>
                                </Link>
                            </li>
                            <li className="nav-item fs-4 my-1 py-2 py-sm-0 mt-4">
                                <Link to="/mypage/support" className={isPathMatch('/mypage/support') || isPathMatch('/mypage/support/withdrawal') ? "nav-link text-white px-2 fs-5 active-link" : "nav-link text-white px-2 fs-5"}>
                                    <i className="fa-solid fa-phone me-3 ps-sm-0 ps-3"></i>
                                    <span className='d-none d-sm-inline'>고객센터</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className='py-4'>
                        <hr className='text-secondary'/>
                        <div className='d-flex justify-content-center'>
                            <i className="fa-solid fa-user fs-5 me-2"></i>
                            <span className='d-none d-sm-inline'>{userName}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid vh-100">
                <Routes>
                    <Route path="" element={<Profile/>}></Route>
                    <Route path="/edit" element={<ProfileEdit/>}></Route>
                    <Route path="/myroutine" element={<MyRoutine/>}></Route>
                    <Route path="/mysocial" element={<MySocial/>}></Route>
                    <Route path="/settings" element={<Settings/>}></Route>            
                    <Route path="/support/*" element={<Support/>}></Route>
                </Routes>
            </div>
        </div>
    
    </>
}