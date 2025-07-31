import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [user, setUser] = useState(null);
  const [exerciseData, setExerciseData] = useState(null);
  const navigate = useNavigate();
  // 슬라이드 설정
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  //로그인한 경우에만 최근 운동기록을 백엔드에서 가져옴
  useEffect(() => {
    //로그인 된 사용자 정보 저장용 상태
    const token = localStorage.getItem('token');
    //사용자 최근 운동기록 저장용 상태
    const userInfo = localStorage.getItem('user');

    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }

    if (!token) return;
    //운동기록 api요청 (토큰 인증 포함)
    fetch('https://mogapi.kro.kr/api/exercise/latest', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('운동 기록을 불러오지 못했습니다');
        return res.json();
      })
      .then(data => {
        setExerciseData(data); //운동 기록 저장
      })
      .catch(err => {
        console.error(err);
        setExerciseData(null); // 신규 회원일 경우 등 기록이 없을때
      });
  }, []);

  useEffect(() => {
    const scriptId = 'kakao-map-script';

    // 스크립트가 이미 존재하면 중복 로드 방지
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src =
        'https://dapi.kakao.com/v2/maps/sdk.js?appkey=87254dcf6291d1a723680f82031c6f79&autoload=false&libraries=services';
      script.async = true;

      script.onload = () => {
        // SDK가 로드되면 명시적으로 maps API 로드
        window.kakao.maps.load(() => {
          initializeMap();
        });
      };

      document.head.appendChild(script);
    } else {
      // 이미 script가 있다면 바로 실행
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          initializeMap();
        });
      }
    }

    function initializeMap() {
      const container = document.getElementById('map');
      if (!container || !window.kakao) return;

      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const userLocation = new window.kakao.maps.LatLng(lat, lng);
          drawMap(userLocation);
        },
        () => {
          const defaultLoc = new window.kakao.maps.LatLng(37.5665, 126.978);
          drawMap(defaultLoc);
        },
      );
    }

    function drawMap(center) {
      const container = document.getElementById('map');
      const options = {
        center,
        level: 5,
      };

      const map = new window.kakao.maps.Map(container, options);
      //줌인,줌아웃 버튼
      document.querySelector('#zoom-in')?.addEventListener('click', () => {
        map.setLevel(map.getLevel() - 1);
      });
      document.querySelector('#zoom-out')?.addEventListener('click', () => {
        map.setLevel(map.getLevel() + 1);
      });
      const ps = new window.kakao.maps.services.Places();
      const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });

      new window.kakao.maps.Marker({
        map,
        position: center,
        title: '현재 위치',
        image: new window.kakao.maps.MarkerImage(
          '/img/location.png',
          new window.kakao.maps.Size(40, 40),
          {
            offset: new window.kakao.maps.Point(20, 40),
          },
        ),
      });
      // 내 위치에 라벨 표시
      const labelOverlay = new window.kakao.maps.CustomOverlay({
        position: center,
        content: `<div style="
            background: white;
            border: 1px solid #ccc;
            border-radius: 16px;
            padding: 4px 10px;
            font-size: 13px;
            color: #333;
            font-weight: 500;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            transform: translateY(-60px);
            white-space: nowrap;
          ">현재 위치</div>`,
      });
      labelOverlay.setMap(map);

      const keywords = ['헬스장', '헬스', '휘트니스', '짐', 'PT', '피트니스', '헬스클럽'];
      keywords.forEach(word => {
        ps.keywordSearch(
          word,
          (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const bounds = new window.kakao.maps.LatLngBounds();

              data.forEach(place => {
                const marker = new window.kakao.maps.Marker({
                  map,
                  position: new window.kakao.maps.LatLng(place.y, place.x),
                });

                window.kakao.maps.event.addListener(marker, 'click', () => {
                  infowindow.setContent(`
                <div style="padding:8px; font-size:13px; width:200px;">
                  <strong>${place.place_name}</strong><br/>
                  ${place.road_address_name || place.address_name}<br/>
                  ${place.phone || '전화번호 없음'}
                </div>
              `);
                  infowindow.open(map, marker);
                });
                bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
              });
            }
          },
          {
            location: center,
            radius: 3000,
          },
        );
      });
    }
  }, []);

  return (
    <div className="main-page">
      {/* Hero Section */}
      <section className="hero-section">
        <video autoPlay muted loop className="background-video">
          <source src="/videos/fitness_hero.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay" />
        <div className="hero-overlay">
          <h1 className="hero-title">MOG와 더 스마트한 운동 루틴</h1>
          <p className="hero-subtitle"> 힘차게 시작해봐요</p>
          <div
            className="hero-button"
            onClick={() => {
              user ? navigate('/data') : navigate('/login');
            }}
          >
            루틴 생성하러 가기
          </div>
        </div>
      </section>

      {/* 서비스 소개 섹션 */}
      <section className="intro-section">
        <h2>서비스 소개</h2>
        <div className="intro-features">
          <div
            className="intro-features-button"
            style={{ cursor: 'pointer' }}
            onClick={() => (user ? navigate('/suggest') : navigate('/login'))}
          >
            맞춤형 루틴
          </div>
          <div
            className="intro-features-button"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              navigate('/pose');
            }}
          >
            자세 피드백
          </div>
          <div className="intro-features-button" style={{ cursor: 'pointer' }}>
            운동 분석
          </div>
        </div>
      </section>

      {/* 추천 루틴 섹션 */}
      <section className="routine-section">
        <h2>오늘의 추천 루틴</h2>
        <div className="routine-slider-wrapper">
          <Slider {...sliderSettings}>
            <div>
              <div className="routine-card">
                <img src={'/icons/Benchpress.svg'} style={{ width: '80px' }} />
                상체 루틴
              </div>
            </div>
            <div>
              <div className="routine-card">
                <img src={'/icons/Squat.svg'} style={{ width: '80px' }} />
                하체 강화 루틴
              </div>
            </div>
            <div>
              <div className="routine-card">
                <img src={'/icons/Running.svg'} style={{ width: '80px' }} />
                전신 유산소 루틴
              </div>
            </div>
          </Slider>
        </div>
      </section>

      {/* 운동 분석 섹션 */}
      <section className="analytics-section">
        <h2>운동 분석</h2>
        <p className="analytics-subtext">회원에게만 제공되는 맞춤 통계 & 피드백</p>
        <div className="analytics-cards">
          {user && exerciseData ? (
            <>
              <div className="analytics-card">
                <h3>소모 칼로리</h3>
                <p>{exerciseData.calories || 0} kcal</p>
              </div>
              <div className="analytics-card">
                <h3>운동 시간</h3>
                <p>{exerciseData.duration || 0}분</p>
              </div>
              <div className="analytics-card">
                <h3>자세 피드백</h3>
                <p>{exerciseData.feedback || '분석 없음'}</p>
              </div>
            </>
          ) : user && exerciseData === null ? (
            <div className="analytics-card">
              <p>아직 운동 기록이 없습니다. 첫 운동을 기록해보세요!</p>
            </div>
          ) : (
            <>
              <div className="analytics-card">
                <h3>소모 칼로리</h3>
                <p>오늘 회원님이 소모한 칼로리를 알려줘요</p>
              </div>

              <div className="analytics-card">
                <h3>운동 시간</h3>
                <p> 오늘 회원님이 운동한 전체 시간을 알려줘요</p>
              </div>
              <div className="analytics-card">
                <h3>자세 피드백</h3>
                <p>
                  오늘 회원님의 운동 자세에
                  <br />
                  대해 말해줘요
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 헬스장 찾기 섹션 */}
      <section className="gymmap-section">
        <h2>MOG가 찾은 헬스장</h2>
        <div className="map-wrapper">
          <div id="map" className="map-placeholder"></div>
          <div className="map-controls">
            <button id="zoom-in">+</button>
            <button id="zoom-out">-</button>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="footer">
        <p>MOG ⓒ 2025</p>
      </footer>
    </div>
  );
}
