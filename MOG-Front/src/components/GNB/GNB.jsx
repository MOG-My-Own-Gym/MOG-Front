import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../pages/Login/AuthContext';
import { NavDropdown, Offcanvas } from 'react-bootstrap';
import axios from 'axios';
import { useModalAlert } from '../../context/ModalAlertContext';
import "./css/GNB.css";

export default function GNB() {
  const [show, setShow] = useState(false);
  const [userData, setUserData] = useState({
    usersName:'',
    nickName:'',
    email:'',
    profileImg:'/img/userAvatar.png'
  })
  const {showModal}=useModalAlert();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, dispatch } = useContext(AuthContext);

  const isPathActive = paths => paths.includes(currentPath);

  useEffect(()=>{
    if(user){
      const fetchProfile = async () =>{
        await axios.get(`http://localhost:8080/api/v1/users/${user.usersId}`)
          .then(res=>{
            setUserData(prev=>({
              ...prev,
              usersName:res.data.usersName,
              nickName:res.data.nickName,
              email:res.data.email,
              profileImg:res.data.profileImg
            }))
          })
          .catch(e=>{
            console.log(e)
            showModal('프로필을 읽어오는 중 오류가 발생하였습니다');
        });
      };
      fetchProfile();
    }
  },[user]);

  const [isOpenRoutine, setIsOpenRoutine] = useState(false);
  const [isOpenWorkout, setIsOpenWorkout] = useState(false);
  const handleClickRoutine=()=>{
    setIsOpenRoutine(!isOpenRoutine);
    setIsOpenWorkout(false);
  };
  const handleClickWorkout=()=>{
    setIsOpenWorkout(!isOpenWorkout);
    setIsOpenRoutine(false);
  };
  const handleClick=()=>{
    setIsOpenRoutine(false);
    setIsOpenWorkout(false);
  };

  
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark fixed-top"
      id="mainNav"
      style={{ width: '100vw', zIndex: 10, backgroundColor: 'black', padding: '15px' }}
    >
      <Link className="navbar-brand" to="/">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <span style={{ color: '#ffc800' }}>MOG</span>
          <div style={{ fontSize: '10px' }}>my own gym</div>
        </div>
      </Link>
      <button
        className="navbar-toggler d-lg-none"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarResponsive"
        aria-controls="navbarResponsive"
        aria-expanded="false"
        aria-label="Toggle navigation"
        onClick={handleShow}
      >
        <i className="fas fa-bars"></i>
      </button>

      {/*데스크탑용 네비게이션 메뉴 */}
      <div className="collapse navbar-collapse d-none d-lg-block" id="navbarResponsive">
        <ul className="navbar-nav text-uppercase ms-auto py-4 py-lg-0" style={{ flexWrap: 'wrap' }}>
          {/*루틴 드롭다운 */}
          {user && (
            <>
              <li className="nav-item">
                <NavDropdown 
                  title={
                    <span className={isPathActive(['/data',])?'active-text':''}>
                      <strong>루틴</strong>
                    </span>
                  }
                  id='nav-routine-dropdown'
                  className='nav-item custom-nav-dropdown'
                  menuVariant='dark'
                  bsPrefix='custom-nav-link'
                >
                  <NavDropdown.Item as={Link} to="/data" className={currentPath.startsWith('/data')?'active-item':''}>루틴생성</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="" className={currentPath===''?'active-item':''}>ai 루틴 추천</NavDropdown.Item>
                </NavDropdown>
              </li>
              {/*운동 드롭다운 */}
              <li className="nav-item">
                <NavDropdown
                  title={
                    <span className={isPathActive(['/stats',])?'active-text':''}>
                      <strong>운동</strong>
                    </span>
                  }
                  id='nav-workout-dropdown'
                  className='nav-item custom-nav-dropdown'
                  menuVariant='dark'
                  bsPrefix='custom-nav-link'
                >
                  <NavDropdown.Item as={Link} to="/stats" className={currentPath==='/stats'?'active-item':''}>통계</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="" className={currentPath===''?'active-item':''}>자세 피드백</NavDropdown.Item>

                </NavDropdown>
              </li>
            </>
            )}
            {/*소셜 */}
            <li className="nav-item">
              <Link className="nav-link-GNB" to="/social">
                {currentPath.startsWith('/social') || currentPath.startsWith('/post') ? (
                  <span style={{ color: '#ffc800' }}>
                    <strong>소셜</strong>
                  </span>
                ) : (
                  '소셜'
                )}
              </Link>
            </li>
            {/*프로필 드롭다운 */}
            {user ? (
              <li className="nav-item ms-3">
                <NavDropdown 
                  title={
                    <div className='nav-link-GNB'>
                      <img className="rounded-circle" width="30px" src={userData.profileImg} 
                        alt={
                          userData.profileImg.trim() === '/img/userAvatar.png'
                            ? 'meaicon - Flaticon 기본이미지'
                            : '개인 프로필 이미지'
                        }
                      />
                    </div>
                  }
                  id='nav-profile-dropdown'
                  className='nav-item profile-nav-dropdown'
                  menuVariant='dark'
                  bsPrefix='custom-nav-link'
                >
                  <div className="card card-profile px-4 pt-5 pb-4" style={{border:"none", boxShadow:"none"}}>
                    <div className="name">
                    {user &&
                      <div className="profile-head d-flex flex-column align-items-center text-white">
                        <h3 style={{color:"#ffc800"}}>{userData.usersName}</h3>
                        <h4>{userData.nickName} </h4>
                        <h5>{userData.email}</h5>
                      </div>
                    }
                      <div className="d-flex flex-row justify-content-around mt-4">
                        <div>
                          <NavDropdown.Item as={Link} to="/mypage" id='profile-dropdown-button1' style={currentPath.startsWith('/mypage')?{color:'white' ,backgroundColor:"#df8c1fff"}:{color:'black'}}>마이페이지</NavDropdown.Item>
                        </div>
                        <div>
                          <NavDropdown.Item as={Link} to="/" id='profile-dropdown-button2' style={{color:'black'}} onClick={() => dispatch({ type: 'LOGOUT' })}>로그아웃</NavDropdown.Item>
                        </div>
                      </div>
                    </div>
                  </div>
                </NavDropdown>
              </li>
            ):(
              <li className="nav-item">
                <Link className="nav-link-GNB" to="/login">
                  {currentPath === '/login' ? (
                    <span style={{ color: '#ffc800' }}>
                      <strong>로그인</strong>
                    </span>
                  ) : (
                    '로그인'
                  )}
                </Link>
              </li>
            )}

            {/*Offcanvas(모바일 햄버거 메뉴) */}
            <Offcanvas show={show} onHide={handleClose} placement='end' style={{backgroundColor:"black"}} className="d-lg-none">
              <Offcanvas.Header closeButton className='d-flex justify-content-end'>
                <Offcanvas.Title></Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
              <ul className='navbar-nav text-uppercase py-4 py-lg-0'>
                {user && (
                  <>
                    <li className='nav-item mb-2'>
                      <span className='nav-link' style={{color:isPathActive(['/data',])?'#FFC800':'white'}} onClick={handleClickRoutine}>
                        루틴
                      </span>
                      {isOpenRoutine && (
                        <ul style={{listStyle:'none', paddingLeft:'20px'}}>
                          <li className='nav-item'>
                            <Link className='nav-link' to="/data" style={{color: isPathActive(['/data'])?'#FFC800':'white'}} onClick={handleClose}>루틴 설정</Link>
                            <Link className='nav-link' to="/" style={{color: isPathActive(['#'])?'#FFC800':'white'}} onClick={handleClose}>ai 루틴 추천</Link>
                          </li>
                        </ul>
                      )}
                    </li>
                    <li className='nav-item mb-2'>
                      <span className='nav-link' style={{color:isPathActive(['/stats',])?'#FFC800':'white'}}  onClick={handleClickWorkout}>
                        운동
                      </span>
                      {isOpenWorkout && (
                        <ul style={{listStyle:'none', paddingLeft:'20px'}}>
                          <li className='nav-item'>
                            <Link className='nav-link' to="/stats" style={{color: isPathActive(['/stats'])?'#FFC800':'white'}} onClick={handleClose}>통계</Link>
                            <Link className='nav-link' to="/" style={{color: isPathActive(['#'])?'#FFC800':'white'}} onClick={handleClose}>자세 피드백</Link>
                          </li>
                        </ul>
                      )}
                    </li>
                  </>
                )}
                <li className='nav-item mb-2'>
                  <Link className='nav-link' to="/social" style={{color: isPathActive(['/social','/post'])?'#FFC800':'white'}} onClick={()=>{handleClose();handleClick();}}>소셜</Link>
                </li>
                {user ? (
                  <>
                    <li className='nav-item mb-2'>
                      <Link className='nav-link' to="/mypage" style={{color: isPathActive(['/mypage'])?'#FFC800':'white'}} onClick={()=>{handleClose();handleClick();}}>마이페이지</Link>
                    </li>
                    <li className='nav-item mb-2'>
                      <Link className='nav-link' to="/logout" style={{color:'white'}} onClick={handleClose}>로그아웃</Link>
                    </li>
                  </>
                ):(
                  <li className='nav-item mb-2'>
                    <Link className='nav-link' to="/login" style={{color: isPathActive(['/login'])?'#FFC800':'white'}} onClick={handleClose}>로그인</Link>
                  </li>
                )}
              </ul>
            </Offcanvas.Body>
          </Offcanvas>
        </ul>
      </div>
    </nav>
  );
}
