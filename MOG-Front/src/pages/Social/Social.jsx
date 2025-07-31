import './Social.css';
import GNB from '../../components/GNB/GNB';
import { useEffect, useState,useContext} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { AuthContext } from '../Login/AuthContext';
import axios from 'axios';

// 무한 반복용 임시 더미데이터
const dummyData = [];
let idCounter = 1;
for (let i = 0; i < 100; i++) {
  dummyData.push(
    {
      id: idCounter++,
      title: `런닝 인증 ${i + 1}`,
      img: '/img/Running.jpeg',
      content: `런닝 기록 내용입니다 ${i + 1}`,
      likes: 0,
      liked: false,
    },
    {
      id: idCounter++,
      title: `요가 인증 ${i + 1}`,
      img: '/img/yoga.jpeg',
      content: `요가 기록 내용입니다 ${i + 1}`,
      likes: 0,
      liked: false,
    },
    {
      id: idCounter++,
      title: `스트레칭 인증 ${i + 1}`,
      img: '/img/stretching.jpg',
      content: `스트레칭 기록 내용입니다 ${i + 1}`,
      likes: 0,
      liked: false,
    },
    {
      id: idCounter++,
      title: `웨이트 인증 ${i + 1}`,
      img: '/img/dumpbell.jpeg',
      content: `웨이트 기록 내용입니다 ${i + 1}`,
      likes: 0,
      liked: false,
    },
    {
      id: idCounter++,
      title: `푸쉬업 인증 ${i + 1}`,
      img: '/img/pushups.jpeg',
      content: `푸쉬업 기록 내용입니다 ${i + 1}`,
      likes: 0,
      liked: false,
    },
    {
      id: idCounter++,
      title: `복근운동 인증 ${i + 1}`,
      img: '/img/abs.jpeg',
      content: `복근운동 기록 내용입니다 ${i + 1}`,
      likes: 0,
      liked: false,
    }
  );
}

export default function Social() {
  const [page, setPage] = useState(1);
  const [cards, setCards] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [ref, inView] = useInView();
  const pageSize = 12;

  const navigate = useNavigate();
   const { user } = useContext(AuthContext);  // 🔸 여기 추가
  const isLogin = !!user; 

  useEffect(() => {
    const fetchData = async () => {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      // 🔸 서버 글 (나중에 연결할 예정)
      let serverCards = [];
      try {
        const res = await axios.get(`/api/v1/posts?page=${page}&size=${pageSize}`);
        const content = Array.isArray(res.data) ? res.data : [];

        serverCards = content.map(post => ({
          id: `s-${post.postId}`,
          title: post.postTitle,
          img: post.postImage?.startsWith('http')
            ? post.postImage
            : `/img/${post.postImage || 'default.jpg'}`,
          content: post.postContent || '',
          likes: 0,
          liked: false,
          fromServer: true,
        }));
      } catch (err) {
        console.warn('서버 불러오기 실패 - 로컬/더미만 사용');
      }

      // ✅ 로컬에서 저장된 게시글 불러오기
      const stored = localStorage.getItem('posts');
      const storedPosts = stored ? JSON.parse(stored) : [];

      const localCards = storedPosts.slice(start, end).map(post => ({
        id: `l-${post.postId}`, // ❗ 로컬 ID 접두어 붙여 구분
        title: post.postTitle,
        img: post.postImage,
        content: post.postContent || '',
        likes: 0,
        liked: false,
        fromLocal: true,
      }));

      // ✅ 더미 카드 (맨 마지막 우선순위 낮음)
      const dummyCards = dummyData.slice(start, end).map(card => {
        const savedLikes = parseInt(localStorage.getItem(`likes-${card.id}`)) || 0;
        const liked = localStorage.getItem(`liked-${card.id}`) === 'true';
        return { ...card, likes: savedLikes, liked };
      });

      // ✅ 최종 카드 합치기 (순서: 로컬 → 서버 → 더미)
      const newCards = [...localCards, ...serverCards, ...dummyCards];

      if (newCards.length === 0) {
        setHasMore(false);
        return;
      }

      setCards(prev => [...prev, ...newCards]);
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
      })
    );
  };

  return (
    <>
      <GNB />
      <main className="social-container">
        {isLogin && (
          <div className="write-button-wrapper">
            <Link to="/social/create">
              <button className="write-btn">글쓰기</button>
            </Link>
          </div>
        )}
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
                    img: card.img,
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
    </>
  );
}