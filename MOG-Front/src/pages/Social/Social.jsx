import './Social.css';
import GNB from '../../components/GNB/GNB';
import { useState } from 'react';

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
  const handleLike = id => {
    setCards(prev =>
      prev.map(card => (card.id === id ? { ...card, likes: card.likes + 1 } : card)),
    );
  };
  return (
    <>
      <GNB />
      <main className="social-container">
        {cards.map(card => (
          <div className="card" key={card.id}>
            <div className="card-overlay">
              <div className="icon-box" onClick={() => handleLike(card.id)}>
                <img src="/img/like.png" alt="좋아요" className="icon" />
                <span>{card.likes}</span>
              </div>
              <div className="icon-box" onClick={() => alert('댓글 페이지로 이동 예정')}>
                <img src="/img/comment.png" alt="댓글" className="icon" />
              </div>
            </div>
            <img src={card.img} alt={card.title} className="card-img" />
          </div>
        ))}
      </main>
    </>
  );
}
