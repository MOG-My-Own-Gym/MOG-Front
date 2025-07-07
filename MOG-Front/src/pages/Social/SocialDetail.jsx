import { useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import './SocialDetail.css';  
import GNB from '../../components/GNB/GNB';

export default function SocialDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { title, img, content } = location.state || {};
  const postId = id;

  const getStoredLikes = () => parseInt(localStorage.getItem(`likes-${postId}`) || '0');
  const getStoredLiked = () => localStorage.getItem(`liked-${postId}`)===true;

  const [likes, setLikes] = useState(getStoredLikes);
  const [liked, setLiked] = useState(getStoredLiked);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const handleLike = () => {
    const updatedLiked= !liked; 
    const updatedLikes= updatedLiked ? likes+1 : likes-1;

    setLikes(updatedLikes);
    setLiked(updatedLiked);

    localStorage.setItem(`liked-${postId}`, updatedLiked.toString());
    localStorage.setItem(`likes-${postId}`, updatedLikes);
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      setComments([...comments, comment]);
      setComment('');
    }
  };

  return (
    <>
      <div className="black-navbar">
      <GNB />
      </div>
    <div className="detail-wrapper">
      <div className="detail-left">
        <h2>상세페이지</h2>
        <p>게시글 ID: {postId}</p>
        <img src={img} alt={title} />
        <h3>{title}</h3>
        <p>{content}</p>
        <div className="detail-likes">
          <img src="/img/like.png" alt="like" onClick={handleLike} />
          <span>{likes} </span>
        </div>
      </div>

      <div className="comment-box">
        <h4>댓글</h4>
        <input
          type="text"
          value={comment}
          placeholder="댓글을 입력하세요"
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={handleCommentSubmit}>등록</button>
        <ul>
          {comments.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
    </div>
    </>
  );
}
