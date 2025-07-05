import './Social.css';
import GNB from '../../components/GNB/GNB';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Social() {
  //더미 데이타
  const [cards, setCards] = useState([
    { id: 1, title: '런닝 인증', img: '/img/Running.jpeg', likes: 0 },
    { id: 2, title: '요가 인증', img: '/img/yoga.jpeg', likes: 0 },
    { id: 3, title: '스트레칭 인증', img: '/img/stretching.jpg', likes: 0 },
    { id: 4, title: '웨이트 인증', img: '/img/dumpbell.jpeg', likes: 0 },
    { id: 5, title: '푸쉬업 인증', img: '/img/pushups.jpeg', likes: 0 },
    { id: 6, title: '복근운동 인증', img: '/img/abs.jpeg', likes: 0 },
  ]);

  const navigate= useNavigate();
  const handleLike = id => {
  setCards(prev =>
    prev.map(card => {
      if (card.id === id) {
        const updatedLikes = card.likes + 1;
        // localStorage에 저장
        localStorage.setItem(`likes-${id}`, updatedLikes);
        return { ...card, likes: updatedLikes };
      }
      return card;
    })
  );
};

  return (
    <>
    <div className='black-navbar'>
      <GNB />
      </div>
      <main className="social-container">
        {cards.map(card => (
          <div className="card" key={card.id} onClick={()=>navigate(`/post/${card.id}`,
          {state:{title:card.title,img:card.img,likes:card.likes,content:'내용을 입력하세요'}})}>
          <img src={card.img} alt={card.title} className="card-img"/>
          <div className='card-overlay'>
          <div className='card-title'>{card.title}</div>
          <div className="icon-box" onClick={(e) =>{
                e.stopPropagation();
                handleLike(card.id);}}
                >
          <img src="/img/like.png" alt="좋아요" className="icon" />
          <span>{card.likes}</span>
          </div>
          
            
            <div className='icon-box' onClick={(e)=>{
              e.stopPropagation();
              navigate(`/post/${card.id}`);
            }}>
              </div>
            </div>
          </div>
        ))}
      </main>
    </>
    )}
