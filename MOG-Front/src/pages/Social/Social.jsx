import './Social.css';
import GNB from '../../components/GNB/GNB';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

 //무한 반복용 임시 더미데이타
  const dummyData= [];
  //유니크한 아이디 번호를 위한 변수 
  let idCounter = 1; 
  for(let i=0;i<100;i++){
  dummyData.push(
    { id: idCounter++, title: `런닝 인증 ${i+1}`, img: '/img/Running.jpeg', likes: 0,liked: false },
    { id: idCounter++, title: `요가 인증 ${i+1}`, img: '/img/yoga.jpeg', likes: 0 ,liked: false},
    { id: idCounter++, title: `스트레칭 인증 ${i+1}`, img: '/img/stretching.jpg', likes: 0,liked: false },
    { id: idCounter++, title: `웨이트 인증 ${i+1}`, img: '/img/dumpbell.jpeg', likes: 0 ,liked: false},
    { id: idCounter++, title: `푸쉬업 인증 ${i+1}`, img: '/img/pushups.jpeg', likes: 0 ,liked: false},
    { id: idCounter++, title: `복근운동 인증 ${i+1}`, img: '/img/abs.jpeg', likes: 0,liked: false},
  );
}

export default function Social() {
 
//상태 정의 
  const [page,setPage]= useState(1);
  const [cards,setCards] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [ref, inView]= useInView();

  const pageSize= 12;

  //데이타 불러오기 
  useEffect(()=>{
    const fetchData = () => {
      const start = (page-1)*pageSize;
      const end= start+pageSize;
      //더미에서 필요한 부분만 잘라서 가져오기 
      //백엔드 연결시 이부분은 axios요청으로 대체할 예정입니다 
      //예시: const res = await axios.get(`/api/posts?page=${page}&size=${pageSize}`);
      const newCards = dummyData.slice(start,end).map(card=>{
        const savedLikes = parseInt(localStorage.getItem(`likes-${card.id}`)) ||0;
        const liked = localStorage.getItem(`liked-${card.id}`)==='true';
        return {...card, likes:savedLikes, liked};
      });
      //더이상 불러올 카드가 없다면 로딩 중지 
      if(newCards.length===0){
        setHasMore(false);
        return;
      }
      //기존 카드목록에 새 카드 추가 
      setCards(prev=>[...prev, ...newCards]);
    }
    if(hasMore) fetchData();
  },[page]);
//스크롤이 마지막 카드에 닿으면 page증가 > 다음 카드 로딩 
  useEffect(()=>{
    if(inView&&hasMore){
      setPage(prev=>prev+1);
    }
  },[inView,hasMore]);
  const navigate= useNavigate();

//좋아요 버튼 클릭 처리 
  const handleLike = id => {
  setCards(prev =>
    prev.map(card => {
      if (card.id === id) {
        const isLiked= !card.liked;
        const updatedLikes = isLiked? card.likes +1 : card.likes-1;
        // localStorage에 저장
        localStorage.setItem(`likes-${id}`, updatedLikes);
        localStorage.setItem(`liked-${id}`, isLiked.toString());
        return { ...card, likes: updatedLikes, liked:isLiked };
      }
      return card;
    })
  );
};

  return (
    <>
     <main className="social-container">
        {cards.map((card, index) => {
          const isLast = index === cards.length - 1;
          return (
          <div className="card" ref={isLast ? ref:null} key={card.id} onClick={()=>navigate(`/post/${card.id}`,
          {state:{title:card.title,img:card.img,likes:card.likes,content:'내용을 입력하세요'}})}>
          <img src={card.img} alt={card.title} className="card-img"/>
          <div className='card-overlay'>
          <div className='card-title'>{card.title}</div>
          <div className="icon-box" onClick={(e) =>{
                e.stopPropagation();
                handleLike(card.id);}}
                >
          <img 
            src={card.liked? "/img/like.png":"/img/emptyredheart.png"}
            alt="좋아요" className="icon" />
          <span>{card.likes}</span>
          </div>
          
            
            <div className='icon-box' onClick={(e)=>{
              e.stopPropagation();
              navigate(`/post/${card.id}`);
            }}>
              </div>
            </div>
          </div>
         );
        })}
      </main>
    </>
    )}
