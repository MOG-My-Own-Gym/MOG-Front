import { useContext, useEffect, useRef, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Login/AuthContext';
import axios from 'axios';
import { useModalAlert } from '../../context/ModalAlertContext';

export default function Support() {
  const { showModal } = useModalAlert();

  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const location = useLocation();
  let currentPath = location.pathname;

  //비밀번호 변경 페이지
  const UpdatePassword = () => {
    //input입력값 저장하는 state
    const [passwords, setPasswords] = useState({
      exPassword: '',
      newPassword: '',
      newPasswordCheck: '',
    });
    const { exPassword, newPassword, newPasswordCheck } = passwords;

    //유효성체크를 위한 Ref
    const exPasswordRef = useRef();
    const newPasswordRef = useRef();
    const checkPasswordRef = useRef();

    //input입력값 제어하는 함수
    const handleChange = e => {
      const { name, value } = e.target;
      //새 비밀번호와 비밀번호확인이 일치하는지 체크
      if (name === 'newPasswordCheck') {
        const checkPassword = document.querySelector('#newPassword').value.trim();
        if (value === checkPassword) {
          checkPasswordRef.current.textContent = value.trim() === '' ? '' : '비밀번호 일치';
          //일치하는 경우에만 newPasswordCheck에 입력값 저장
          setPasswords(prev => ({ ...prev, newPasswordCheck: value }));
        } else if (value !== checkPassword) {
          checkPasswordRef.current.textContent =
            value.trim() === '' ? '' : '비밀번호가 일치하지 않습니다';
        }
      } else setPasswords(prev => ({ ...prev, [name]: value })); //newPasswordCheck를 제외한 키값은 유효성 체크 없이 바로 저장
    };

    const handleClick = e => {
      e.preventDefault();
      //유효성 체크
      if (exPassword.trim().length === 0) {
        exPasswordRef.current.textContent = '현재 비밀번호를 입력해주세요';
        document.querySelector('#exPassword').focus();
        return;
      }
      if (newPassword.trim().length === 0) {
        newPasswordRef.current.textContent = '새 비밀번호를 입력해주세요';
        document.querySelector('#newPassword').focus();
        return;
      }

      //비밀번호확인이 일치하지 않은채로 제출버튼을 누른경우
      if (newPasswordCheck.trim().length === 0) {
        showModal('새 비밀번호가 일치하지 않습니다');
        document.querySelector('#newPasswordCheck').focus();
        return;
      }

      //유효성체크에 모두 통과한 경우 입력한 현재비밀번호가 네트워크에 저장된 user의 비밀번호와 일치하는지 판단
      async function fetchPassword() {
        try {
          const res1 = await axios.post(
            'http://158.180.78.252:8080/api/v1/users/auth/password/check',
            { password: exPassword },
            { withCredentials: true, headers: { Authorization: `Bearer ${user.accessToken}` } },
          );
        } catch (err1) {
          console.log('첫 번째 호출 오류 발생:', err1);
          showModal('현재 비밀번호가 일치하지 않습니다');
          return;
        }
        //입력한 현재 비밀번호가 일치한다면 비밀번호변경api 요청
        try {
          const res2 = await axios.put(
            'http://158.180.78.252:8080/api/v1/users/auth/password/update',
            {
              originPassword: exPassword,
              newPassword: newPasswordCheck,
            },
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${user.accessToken}`,
              },
            },
          );
          showModal('비밀번호가 변경되었습니다');
          //변경된 경우 새로고침
          navigate('/mypage/support');
        } catch (err2) {
          console.log('두 번째 호출 오류 발생:', err2);
          showModal('비밀번호 변경에 실패하였습니다');
        }
      }
      fetchPassword();
    };

    //비밀번호변경 UI
    return (
      <>
        <div>
          <div>
            <label>현재 비밀번호</label>
            <input
              id="exPassword"
              type="password"
              className="form-control"
              placeholder="현재 비밀번호"
              name="exPassword"
              onChange={handleChange}
            />
            <span ref={exPasswordRef} style={{ color: '#FF0000' }}></span>
          </div>
          <hr className="my-3" />
          <div>
            <label>새 비밀번호</label>
            <input
              id="newPassword"
              type="password"
              className="form-control"
              placeholder="새 비밀번호"
              name="newPassword"
              onChange={handleChange}
            />
            <span ref={newPasswordRef} style={{ color: '#FF0000' }}></span>
          </div>
          <div className="pt-3">
            <label>새 비밀번호 확인</label>
            <input
              id="newPasswordCheck"
              type="password"
              className="form-control"
              placeholder="새 비밀번호"
              name="newPasswordCheck"
              onChange={handleChange}
            />
            <span ref={checkPasswordRef} style={{ color: '#0000FF' }}></span>
          </div>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-warning mt-5"
              onClick={handleClick}
              style={{ backgroundColor: '#fdc800', border: 'none' }}
            >
              확인
            </button>
          </div>
        </div>
      </>
    );
  };

  //회원 탈퇴 페이지
  const WithdrawalUser = () => {
    const passwordRef = useRef();

    //input에 입력값이 없는 경우 유효성체크용 에러메세지 초기화
    const handleChange = e => {
      if (e.target.value === '') passwordRef.current.textContent = '';
    };

    //회원탈퇴버튼 제어하는 함수
    const handleClick = e => {
      e.preventDefault();
      let res1 = '';
      //입력한 비밀번호가 네트워크에 저장된 user의 비밀번호와 일치하는지 판단
      async function fetchWithdrawal() {
        try {
          res1 = await axios.post(
            'http://158.180.78.252:8080/api/v1/users/auth/password/check',
            { password: document.querySelector('#currentPassword').value },
            { withCredentials: true, headers: { Authorization: `Bearer ${user.accessToken}` } },
          );
        } catch (err1) {
          console.log('첫 번째 호출 오류 발생:', err1);
          showModal('현재 비밀번호가 일치하지 않습니다');
          return; //일치하지 않는경우 바로 return
        }

        //일치한다면 탈퇴여부를 확인하는 알림창 한번 더 띄우기
        const confirmWithdrawal = confirm('정말 탈퇴하시겠습니까?');

        //사용자가 '확인'을 누른 경우 회원탈퇴 api요청
        if (confirmWithdrawal) {
          try {
            const res2 = await axios.delete(
              `http://158.180.78.252:8080/api/v1/users/delete/${res1.data.usersId}`,
              {
                withCredentials: true,
                headers: {
                  Authorization: `Bearer ${user.accessToken}`,
                },
              },
            );
            //탈퇴되었다는 알러트 띄우기
            showModal('탈퇴되었습니다');
            //로그아웃 처리
            dispatch({ type: 'LOGOUT' });
            //홈으로 이동
            navigate('/');
          } catch (err2) {
            console.log('두 번째 호출 오류 발생:', err2);
            showModal('회원탈퇴에 실패하였습니다');
          }
        } //'취소'를 누른경우 회원탈퇴 취소
        else showModal('회원탈퇴가 취소되었습니다');
      }
      fetchWithdrawal();
    };

    //회원탈퇴 UI
    return (
      <>
        <div>
          <div>
            <label>현재 비밀번호</label>
            <input
              id="currentPassword"
              type="password"
              className="form-control"
              placeholder="현재 비밀번호"
              name="password"
              onChange={handleChange}
            />
            <span ref={passwordRef} style={{ color: '#FF0000' }}></span>
          </div>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-warning mt-5"
              onClick={handleClick}
              style={{ backgroundColor: '#fdc800', border: 'none' }}
            >
              회원 탈퇴
            </button>
          </div>
        </div>
      </>
    );
  };

  //고객센터 페이지
  const CardActive = () => {
    //카드헤더탭 액티브 여부 판단용
    const [isActive, setIsActive] = useState(false);

    //최초렌더링시 경로에 따라 액티브 여부 토글
    useEffect(() => {
      if (currentPath === '/mypage/support') setIsActive(!isActive);
    }, []);

    //카드 헤더 탭 UI
    return (
      <>
        <li className="nav-item">
          {isActive ? (
            <Link aria-current="true" to="/mypage/support" className="nav-link active">
              비밀번호 변경
            </Link>
          ) : (
            <Link aria-current="false" to="/mypage/support" className="nav-link">
              비밀번호 변경
            </Link>
          )}
        </li>
        <li className="nav-item">
          {isActive ? (
            <Link aria-current="false" to="/mypage/support/withdrawal" className="nav-link">
              회원 탈퇴
            </Link>
          ) : (
            <Link aria-current="true" to="/mypage/support/withdrawal" className="nav-link active">
              회원 탈퇴
            </Link>
          )}
        </li>
      </>
    );
  };

  //고객센터페이지 UI
  return (
    <>
      <div className="container pt-5">
        <div className="container-fluid d-flex">
          <div className="card w-100 h-100">
            <div className="card-header text-center">
              <ul className="nav nav-tabs card-header-tabs">
                <CardActive />
              </ul>
            </div>
            <div className="card-body p-4">
              <Routes>
                <Route path="" element={<UpdatePassword />}></Route>
                <Route path="/withdrawal" element={<WithdrawalUser />}></Route>
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
