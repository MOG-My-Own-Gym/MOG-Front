import './Social.css';
import GNB from '../../components/GNB/GNB';
import { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { AuthContext } from '../Login/AuthContext';
import axios from 'axios';

// 무한 반복용 임시 더미데이터
// const dummyData = [];
// let idCounter = 1;
// for (let i = 0; i < 100; i++) {
//   dummyData.push(
//     {
//       id: idCounter++,
//       title: `런닝 인증 ${i + 1}`,
//       img: '/img/Running.jpeg',
//       content: `런닝 기록 내용입니다 ${i + 1}`,
//       likes: 0,
//       liked: false,
//     },
//     {
//       id: idCounter++,
//       title: `요가 인증 ${i + 1}`,
//       img: '/img/yoga.jpeg',
//       content: `요가 기록 내용입니다 ${i + 1}`,
//       likes: 0,
//       liked: false,
//     },
//     {
//       id: idCounter++,
//       title: `스트레칭 인증 ${i + 1}`,
//       img: '/img/stretching.jpg',
//       content: `스트레칭 기록 내용입니다 ${i + 1}`,
//       likes: 0,
//       liked: false,
//     },
//     {
//       id: idCounter++,
//       title: `웨이트 인증 ${i + 1}`,
//       img: '/img/dumpbell.jpeg',
//       content: `웨이트 기록 내용입니다 ${i + 1}`,
//       likes: 0,
//       liked: false,
//     },
//     {
//       id: idCounter++,
//       title: `푸쉬업 인증 ${i + 1}`,
//       img: '/img/pushups.jpeg',
//       content: `푸쉬업 기록 내용입니다 ${i + 1}`,
//       likes: 0,
//       liked: false,
//     },
//     {
//       id: idCounter++,
//       title: `복근운동 인증 ${i + 1}`,
//       img: '/img/abs.jpeg',
//       content: `복근운동 기록 내용입니다 ${i + 1}`,
//       likes: 0,
//       liked: false,
//     }
//   );
// }

export default function Social() {
  const [page, setPage] = useState(1);
  const [cards, setCards] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [ref, inView] = useInView();
  const pageSize = 12;

  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // 🔸 여기 추가
  const isLogin = !!user;

  useEffect(() => {
    const fetchData = async () => {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      let serverCards = [];
      try {
        const res = await axios.get(`https://mogapi.kro.kr/api/v1/posts/list`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });
        const content = Array.isArray(res.data) ? res.data : [];

        serverCards = content.map(post => ({
          id: post.postId,
          title: post.postTitle,
          img: post.postImage || '/img/default.png',
          content: post.postContent || '',
          likes: 0,
          liked: false,
          fromServer: true,
        }));
      } catch (err) {
        console.warn(err);
      }

      setCards(serverCards);
    };

    if (hasMore) fetchData();
  }, [page]);

  useEffect(() => {
    if (inView && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [inView, hasMore]);

  const handleLike = id => {
    setCards(prev =>
      prev.map(card => {
        if (card.id === id) {
          const isLiked = !card.liked;
          const updatedLikes = isLiked ? card.likes + 1 : card.likes - 1;
          localStorage.setItem(`likes-${id}`, updatedLikes);
          localStorage.setItem(`liked-${id}`, isLiked.toString());
          return { ...card, likes: updatedLikes, liked: isLiked };
        }
        return card;
      }),
    );
  };

  return (
    <div className="social">
      {isLogin && (
        <div className="write-button-wrapper">
          <Link to="/social/create">
            <button className="write-btn">글쓰기</button>
          </Link>
        </div>
      )}
      <main className="social-container">
        {cards.map((card, index) => {
          const isLast = index === cards.length - 1;
          return (
            <div
              className="card"
              ref={isLast ? ref : null}
              key={`card-${card.id}`}
              onClick={() =>
                navigate(`/post/${card.id}`, {
                  state: {
                    title: card.title,
                    img: card.img || '/img/default.png',
                    content: card.content || '내용 없음',
                  },
                })
              }
            >
              <img src={card.img} alt={card.title} className="card-img" />
              <div className="card-overlay">
                <div className="card-title">{card.title}</div>
                <div
                  className="icon-box"
                  onClick={e => {
                    e.stopPropagation();
                    handleLike(card.id);
                  }}
                >
                  <img
                    src={card.liked ? '/img/like.png' : '/img/emptyredheart.png'}
                    alt="좋아요"
                    className="icon"
                  />
                  <span>{card.likes}</span>
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
