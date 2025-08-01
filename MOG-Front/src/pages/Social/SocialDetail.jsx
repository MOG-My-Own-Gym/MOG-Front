import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './SocialDetail.css';
import GNB from '../../components/GNB/GNB';
import axios from 'axios';

export default function SocialDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const postId = id.startsWith('s-') ? id.slice(2) : id;

  const getStoredLikes = () => parseInt(localStorage.getItem(`likes-${id}`) || '0');
  const getStoredLiked = () => localStorage.getItem(`liked-${id}`) === 'true';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [img, setImg] = useState('');
  const [likes, setLikes] = useState(getStoredLikes);
  const [liked, setLiked] = useState(getStoredLiked);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  // ✅ 게시글 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      // 팀원이 만든 Post 상세 정보 조회 API입니다.
      const token = localStorage.getItem('jwtToken');
      const response = await axios
        .get(`http://localhost:8080/api/v1/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        })
        .then(res => {
          const post = res.data;
          setTitle(post.postTitle);
          setContent(post.postContent);
          setImg(post.postImage);
        })
        .catch(err => {
          console.warn('서버 게시글 조회 실패, 로컬 fallback 시도');

          const stored = localStorage.getItem('posts');
          if (stored) {
            const posts = JSON.parse(stored);
            const found = posts.find(p => String(p.postId) === String(postId));
            if (found) {
              setTitle(found.postTitle);
              setContent(found.postContent);
              setImg(found.postImage);
              return;
            }
          }

          alert('게시글을 불러오지 못했습니다.');
        });
    };
  }, [postId]);

  const handleLike = () => {
    const updatedLiked = !liked;
    const updatedLikes = updatedLiked ? likes + 1 : likes - 1;

    setLikes(updatedLikes);
    setLiked(updatedLiked);
    localStorage.setItem(`liked-${id}`, updatedLiked.toString());
    localStorage.setItem(`likes-${id}`, updatedLikes);
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      setComments(prev => [...prev, comment]);
      setComment('');
    }
  };

  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      axios
        .delete(`/api/v1/posts/${postId}`)
        .then(() => {
          alert('삭제되었습니다.');
          navigate('/social');
          window.location.reload();
        })
        .catch(() => {
          console.warn('[개발모드] 서버 없음 - 로컬로 삭제 처리');

          const stored = localStorage.getItem('posts');
          const posts = stored ? JSON.parse(stored) : [];

          const cleanId = id.startsWith('s-') || id.startsWith('l-') ? id.slice(2) : id;

          const updated = posts.filter(p => String(p.postId) !== String(cleanId));

          localStorage.setItem('posts', JSON.stringify(updated));

          alert('삭제되었습니다.');
          navigate('/social');
          window.location.reload();
        });
    }
  };

  const getImageSrc = img => {
    if (!img) return '';
    if (img.startsWith('blob:')) return img;
    if (img.startsWith('/img/')) return img;
    return `/img/${img}`;
  };

  return (
    <>
      <GNB />
      <div className="detail-wrapper">
        <div className="detail-left">
          <h2>상세페이지</h2>
          <p>게시글 ID: {postId}</p>

          {img ? (
            <img src={getImageSrc(img)} alt={title} />
          ) : (
            <div className="img-placeholder">이미지 없음</div>
          )}

          <h3>{title}</h3>
          <p>{content}</p>

          <div className="detail-likes">
            <img src="/img/like.png" alt="like" onClick={handleLike} />
            <span>{likes}</span>
          </div>

          <div className="btn-wrapper">
            <button className="action-btn" onClick={() => navigate(`/social/edit/${postId}`)}>
              수정하기
            </button>
            <button className="action-btn" onClick={handleDelete}>
              삭제하기
            </button>
            <button className="action-btn" onClick={() => navigate('/social')}>
              목록으로
            </button>
          </div>

          <div className="comment-box">
            <h4>댓글</h4>
            <input
              type="text"
              value={comment}
              placeholder="댓글을 입력하세요"
              onChange={e => setComment(e.target.value)}
            />
            <button onClick={handleCommentSubmit}>등록</button>
            <ul>
              {comments.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
