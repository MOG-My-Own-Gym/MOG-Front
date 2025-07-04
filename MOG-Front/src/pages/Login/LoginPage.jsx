

import React from 'react';
import Slider from 'react-slick';

import './Home.css';            
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
  pauseOnHover: true,
};

const slides = [
  { title: '당신의 건강 파트너', subtitle: '맞춤형 운동 루틴.', cta: '스케줄러 시작하기', bg: '/images/hero1.jpg' },
  { title: '루틴, 더 쉽고 빠르게', subtitle: ' 루틴으로 성과를 높이세요.', cta: '시작하기', bg: '/images/hero2.jpg' },
  { title: '소셜', subtitle: '다른 유저의 루틴을 참고하고 공유해 보세요.', cta: '소셜 이동', bg: '/images/hero3.jpg' },
];

const featuresData = [
  { icon: '/icons/calendar.svg', title: '00루틴', desc: '손쉽게 관리' },
  { icon: '/icons/auto-generate.svg', title: '루틴', desc: '사용자 목표에 루틴을 제안' },
  { icon: '/icons/ai.svg', title: '루틴', desc: '운동 코칭' },
];

const routines = ['통계 1', '통계 2', '통계 3'];

const Home = () => (
  <>
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
          <img src={item.icon} alt={item.title} className="mh-features__icon" />
          <h3 className="mh-features__title">{item.title}</h3>
          <p className="mh-features__desc">{item.desc}</p>
        </div>
      ))}
    </section>

    <section className="mh-community">
      <h2 className="mh-community__heading">통계</h2>
      <div className="mh-community__slider">
        {routines.map((r, i) => (
          <div key={i} className="mh-routine-card">{r}</div>
        ))}
      </div>
    </section>
  </>
);

export default Home;
