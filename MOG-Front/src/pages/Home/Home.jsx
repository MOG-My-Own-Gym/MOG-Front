

import React from 'react';
import Slider from 'react-slick';


import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: true
};

const slides = [
  {
    title: '당신의 건강 파트너',
    subtitle: 'AI 기반 맞춤형 운동 루틴을 만나보세요.',
    cta: '스케줄러 시작하기',
    bg: ''
  },
  {
    title: '루틴, 더 쉽고 빠르게',
    subtitle: '자동 생성된 루틴으로 성과를 높이세요.',
    cta: '시작하기',
    bg: ''
  },
  {
    title: '커뮤니티4',
    subtitle: '다른 유저의 루틴을 참고하고 공유해 보세요.',
    cta: '커뮤니티 이동',
    bg: ''
  },
  {
    title: '커뮤니티4',
    subtitle: '다른 유저의 루틴을 참고하고 공유해 보세요.',
    cta: '커뮤니티 이동',
    bg: ''
  },
  {
    title: '커뮤니티5',
    subtitle: '다른 유저의 루틴을 참고하고 공유해 보세요.',
    cta: '커뮤니티 이동',
    bg: ''
  }
];
const featuresData = [
  {
    icon: '/',
    title: '간편한 일정 관리',
    desc: '드래그 앤 드롭으로 스케줄을 손쉽게 관리'
  },
  {
    icon: '',
    title: '루틴 자동 생성',
    desc: '사용자 목표에 맞춰 자동으로 루틴을 제안'
  },
  {
    icon: '',
    title: 'AI 맞춤 추천',
    desc: '실시간 피드백 기반 운동 코칭'
  }
];
 const routines = [
  { title: '루틴 카드 1', img: '/images/cad1.jpeg' },
  { title: '루틴 카드 2', img: '/images/cad2.jpeg' },
  { title: '루틴 카드 3', img: '/images/cad3.jpeg' },
  { title: '루틴 카드 4', img: '/images/cad4.jpeg' },
  { title: '루틴 카드 5', img: '/images/cad5.jpeg' },
];

const Home = () => (
  <>
    <style>{`
     
      .mh-header {
        position: fixed; top: 0; width: 100%;
        background: #fff; box-shadow: 0 2px 4px rgba(255, 7, 7, 0.44); z-index: 1000;
      }
      .mh-header__inner {
        max-width: 1140px; margin: 0 auto;
        display: flex; justify-content: space-between; align-items: center;
        padding: 0.5rem 1rem;
      }
      .mh-logo { font-size: 1.5rem; font-weight: bold; }
      .mh-nav__link {
        margin-left: 1rem; text-decoration: none; color: #333;
      }
      /*회원가입*/
      .mh-nav__link--primary {
        background: #007aff; color: #fff;
        padding: 0.5rem 1rem; border-radius: 4px;
      }

      .mh-hero { position: relative; margin-top: 60px; }
      .mh-hero__slide {
        height: 80vh; background-size: cover;
        background-position: center; position: relative;
      }
      .mh-hero__content {
        position: absolute; top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        text-align: center; color: #fff; padding: 0 1rem;
      }
      .mh-hero__title { font-size: 3rem; margin-bottom: 0.5rem; }
      .mh-hero__subtitle { font-size: 1.25rem; margin-bottom: 1rem; }
      .mh-button--large {
        padding: 0.75rem 2rem; font-size: 1rem;
        border: none; border-radius: 4px; cursor: pointer;
      }
      .slick-dots li button:before { font-size:12px; color:rgba(67, 34, 34, 0.7); }
      .slick-dots li.slick-active button:before { color:#fff; }

     
      .mh-features {
        display: flex; justify-content: space-between;
        max-width: 1140px; margin: 3rem auto; padding: 0 1rem;
      }
      .mh-features__item {
        flex: 1; text-align: center; padding: 1rem;
      }
      .mh-features__icon {
        width: 48px; height: 48px; margin-bottom: 1rem;
      }
      .mh-features__title { font-size: 1.25rem; margin-bottom: 0.5rem; }
      .mh-features__desc { color: #666; font-size: 1rem; }
      @media (max-width: 768px) {
        .mh-features { flex-direction: column; }
        .mh-features__item { margin-bottom: 2rem; }
      }

      .mh-community {
        max-width: 1140px; margin: 3rem auto; padding: 0 1rem;
        text-align: center;
      }
      .mh-community__heading {
        font-size: 2rem; margin-bottom: 1.5rem;
      }
      .mh-community__slider {
        display: flex; gap: 1rem; overflow-x: auto;
        scroll-snap-type: x mandatory;
      }
      .mh-routine-card {
        min-width: 200px; height: 150px; background: #f9f9f9;
        border-radius: 8px; display: flex;
        justify-content: center; align-items: center;
        scroll-snap-align: start;
      }
      .mh-button--outline {
        padding: 0.75rem 2rem; font-size: 1rem;
        border: 1px solid #007aff; border-radius: 4px;
        background: #fff; color: #007aff; cursor: pointer;
        margin-top: 1.5rem;
      }
    `}</style>

    
    <header className="mh-header">
      <div className="mh-header__inner">
        <div className="mh-logo">MOG</div>
        <nav>
          <a href="/login" className="mh-nav__link">로그인</a>
          <a href="/signup" className="mh-nav__link mh-nav__link--primary">
            회원가입
          </a>
        </nav>
      </div>
    </header>

   
    <section className="mh-hero">
      <Slider {...settings}>
        {slides.map((s, i) => (
          <div
            key={i}
            className="mh-hero__slide"
            style={{ backgroundImage: `url(${s.bg})` }}
          >
            <div className="mh-hero__content">
              <h1 className="mh-hero__title">{s.title}</h1>
              <p className="mh-hero__subtitle">{s.subtitle}</p>
              <button className="mh-button--large">{s.cta}</button>
            </div>
          </div>
        ))}
      </Slider>
    </section>

   
    <section className="mh-features">
      {featuresData.map((item, i) => (
        <div key={i} className="mh-features__item">
          <img src={item.icon} alt={item.title} className="mh-features__icon"/>
          <h3 className="mh-features__title">{item.title}</h3>
          <p className="mh-features__desc">{item.desc}</p>
        </div>
      ))}
    </section>

   
    <section className="mh-community">
      <h2 className="mh-community__heading">소셜(루틴공유?)
      </h2>
      <div className="mh-community__slider">
        {routines.map((r, i) => (
          <div key={i} className="mh-routine-card">{r}</div>
        ))}
      </div>
      <button className="mh-button--outline">
        나만의 루틴 공유하기
      </button>
    </section>
  </>
);

export default Home;
