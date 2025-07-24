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
import { useModalAlert } from "../../context/ModalAlertContext";

export default function MyPage(){
    const {showModal}=useModalAlert();
    const { user } = useContext(AuthContext);
    const [userName, setUserName] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen]=useState(false);
    const location = useLocation();

    const isPathMatch = pathname =>{
        if(pathname === '/mypage'){
            return location.pathname === '/mypage' || location.pathname ==='/mypage/edit';
        }
        if(pathname === '/mypage/support'){
            return location.pathname.startsWith('/mypage/support');
        }
        return location.pathname === pathname;
    };

    useEffect(()=>{
        axios.get(`http://localhost:8080/api/v1/users/${user.usersId}`)
            .then(res=>{
                setUserName(res.data.nickName);
            })
            .catch(err=>{
                console.log(err);
                showModal('사용자 정보를 가져오는 중 오류가 발생하였습니다.');
        });
    },[]);

    const toggleMobileMenu =e=>{
        e.preventDefault();
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    useEffect(()=>{
        if(isMobileMenuOpen){
            document.body.style.overflow='hidden';
        }else{
            document.body.style.overflow='';
        }

        return ()=>{
            document.body.style.overflow='';
        };
    },[isMobileMenuOpen]);

    useEffect(()=>{
        setIsMobileMenuOpen(false);
    },[location.pathname]);

    const menuItem =[
        { path: '/mypage', icon: 'fa-solid fa-circle-user', name: '프로필' },
        { path: '/mypage/myroutine', icon: 'fa-solid fa-dumbbell', name: '나의 루틴' },
        { path: '/mypage/mysocial', icon: 'fa-solid fa-image', name: '나의 소셜' },
        { path: '/mypage/settings', icon: 'fa-solid fa-gear', name: '환경설정' },
        { path: '/mypage/support', icon: 'fa-solid fa-phone', name: '고객센터' }
    ];

    return<>
        <div className="d-flex">
            {/*데스크톱/태블릿용 사이드바 시작 */}
            <div className="sidebar-main d-none d-md-block col-md-3 col-lg-2 bg-black text-white px-3 vh-100">
                <div className="d-flex flex-column justify-content-between h-100">
                    <div>
                        <ul className="nav nav-pills-mypage flex-column px-0">
                            <li className="nav-item fs-4 my-1 py-2 py-sm-0 mt-4">
                                <Link to="/mypage" className={isPathMatch(menuItem[0].path) ? "nav-link text-white px-2 fs-5 active-link" : "nav-link text-white px-2 fs-5"}>
                                    <i className="fa-solid fa-circle-user me-3 ps-sm-0 ps-3"></i>
                                    <span className='d-none d-sm-inline'>프로필</span>
                                </Link>
                            </li>
                            <hr className="text-secondary d-none d-sm-block"/>
                            <li className="nav-item fs-4 my-1 py-2 py-sm-0 mt-4">
                                <Link to="/mypage/myroutine" className={isPathMatch(menuItem[1].path) ? "nav-link text-white px-2 fs-5 active-link" : "nav-link text-white px-2 fs-5"}>
                                    <i className="fa-solid fa-dumbbell me-3 ps-sm-0 ps-3"></i>
                                    <span className='d-none d-sm-inline'>나의 루틴</span>
                                </Link>
                            </li>
                            <li className="nav-item fs-4 my-1 py-2 py-sm-0 mt-4">
                                <Link to="/mypage/mysocial" className={isPathMatch(menuItem[2].path) ? "nav-link text-white px-2 fs-5 active-link" : "nav-link text-white px-2 fs-5"}>
                                    <i className="fa-solid fa-image me-3 ps-sm-0 ps-3"></i>
                                    <span className='d-none d-sm-inline'>나의 소셜</span>
                                </Link>
                            </li>
                            <hr className="text-secondary d-none d-sm-block"/>
                            <li className="nav-item fs-4 my-1 py-2 py-sm-0 mt-4">
                                <Link to="/mypage/settings" className={isPathMatch(menuItem[3].path) ? "nav-link text-white px-2 fs-5 active-link" : "nav-link text-white px-2 fs-5"}>
                                    <i className="fa-solid fa-gear me-3 ps-sm-0 ps-3"></i>
                                    <span className='d-none d-sm-inline'>환경설정</span>
                                </Link>
                            </li>
                            <li className="nav-item fs-4 my-1 py-2 py-sm-0 mt-4">
                                <Link to="/mypage/support" className={isPathMatch(menuItem[4].path) ? "nav-link text-white px-2 fs-5 active-link" : "nav-link text-white px-2 fs-5"}>
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
            {/*데스크톱/태블릿용 사이드바 끝 */}

            {/*모바일용 플로팅 버튼(md이하에서만 보임) */}
            <div className="d-md-none floating-button-container">
                <button className={`btn btn-warning rounded-circle floating-button ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
                    {isMobileMenuOpen ? (
                        <i className="fa-solid fa-times fs-3"></i>
                        ):(
                        <i className="fa-solid fa-bars fs-3"></i>
                    )}
                </button>
            </div>

            {/*버튼 클릭시 나타나는 모바일 메뉴 오버레이 */}
            {isMobileMenuOpen && (
                <>
                    <div className="mobile-menu-overlay" onClick={toggleMobileMenu}></div>
                    <div className="mobile-menu-content">
                        <ul className="list-group">
                            {menuItem.map((item)=>(
                                <li className="list-group-item" key={item.path}>
                                    <Link to={item.path} 
                                        className={`nav-link text-decoration-none w-100 text-start ${isPathMatch(item.path)?'active-link':''}`}
                                        onClick={()=>setIsMobileMenuOpen(false)}>
                                        <i className={`${item.icon} me-3`}></i>
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}

            <div className="container-fluid vh-100 flex-grow-1">
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