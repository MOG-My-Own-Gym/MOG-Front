import { Link, Route, Routes } from "react-router-dom";
import "./mypage.css";
import Profile from "./Profile";
import MyRoutine from "./MyRoutine";
import MySocial from "./MySocial";
import Settings from "./Settings";
import Support from "./Support";

export default function MyPage(){


    return<>
        <div className="d-flex">
            <div className="col-auto">
                {/*사이드바 시작 */}
                <div className="sidebar d-flex flex-column col-auto justify-content-between bg-dark text-white px-3 vh-100">
                    <div>
                        <ul className="nav nav-pills flex-column px-0" id='padding'>
                            <li className="nav-item fs-4 my-1 py-2 py-sm-0 mt-4">
                                <Link to="/mypage" className="nav-link text-white px-2 fs-5">
                                    <i className="fa-solid fa-circle-user me-3 ps-sm-0 ps-3"></i>
                                    <span className='d-none d-sm-inline'>프로필</span>
                                </Link>
                            </li>
                            <hr className="text-secondary d-none d-sm-block"/>
                            <li className="nav-item fs-4 my-1 py-2 py-sm-0 mt-4">
                                <Link to="/mypage/myroutine" className="nav-link text-white px-2 fs-5">
                                    <i className="fa-solid fa-dumbbell me-3 ps-sm-0 ps-3"></i>
                                    <span className='d-none d-sm-inline'>나의 루틴</span>
                                </Link>
                            </li>
                            <li className="nav-item fs-4 my-1 py-2 py-sm-0 mt-4">
                                <Link to="/mypage/mysocial" className="nav-link text-white px-2 fs-5">
                                    <i className="fa-solid fa-image me-3 ps-sm-0 ps-3"></i>
                                    <span className='d-none d-sm-inline'>나의 소셜</span>
                                </Link>
                            </li>
                            <hr className="text-secondary d-none d-sm-block"/>
                            <li className="nav-item fs-4 my-1 py-2 py-sm-0 mt-4">
                                <Link to="/mypage/settings" className="nav-link text-white px-2 fs-5">
                                    <i className="fa-solid fa-gear me-3 ps-sm-0 ps-3"></i>
                                    <span className='d-none d-sm-inline'>환경설정</span>
                                </Link>
                            </li>
                            <li className="nav-item fs-4 my-1 py-2 py-sm-0 mt-4">
                                <Link to="/mypage/support" className="nav-link text-white px-2 fs-5">
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
                            <span className='d-none d-sm-inline'>Username</span>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Routes>
                    <Route path="" element={<Profile/>}></Route>
                    <Route path="/myroutine" element={<MyRoutine/>}></Route>
                    <Route path="/mysocial" element={<MySocial/>}></Route>
                    <Route path="/settings" element={<Settings/>}></Route>            
                    <Route path="/support" element={<Support/>}></Route>
                </Routes>
            </div>
        </div>
    
    </>
}