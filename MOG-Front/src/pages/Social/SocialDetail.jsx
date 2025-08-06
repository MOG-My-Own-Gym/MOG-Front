import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useContext, useMemo } from 'react';
import './SocialDetail.css';
import GNB from '../../components/GNB/GNB';
import axios from 'axios';
import { AuthContext } from '../Login/AuthContext';
import { Container, Image } from 'react-bootstrap';
import { URL } from '../../config/constants';

export default function SocialDetail() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const postId = id.startsWith('s-') ? id.slice(2) : id;

  const [author, setAuthor] = useState();
  const [post, setPost] = useState({});
  //const [title, setTitle] = useState('');
  //const [content, setContent] = useState('');
  const [img, setImg] = useState('');
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  // 게시글 불러오기
  const fetchPost = async () => {
    //setIsLoading(true);
    // 팀원이 만든 Post 상세 정보 조회 API입니다.
    await axios
      .get(`${URL.SOCIALPOSTS}/${postId}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then(res => {
        setPost(res.data);
      })
      .catch(err => {
        console.warn('서버 게시글 조회 실패, 로컬 fallback 시도');

        // const stored = localStorage.getItem('posts');
        // if (stored) {
        //   const posts = JSON.parse(stored);
        //   const found = posts.find(p => String(p.postId) === String(postId));
        //   if (found) {
        //     setTitle(found.postTitle);
        //     setContent(found.postContent);
        //     setImg(found.postImage);
        //     return;
        //   }
        // }

        alert('게시글을 불러오지 못했습니다.');
      });
  };

  //댓글 불러오기
  const fetchComments = async () => {
    await axios
      .get(`${URL.SOCIALPOSTS}/${id}/comments`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then(res => {
        setComments(res.data);
        //console.log('Comments: ',res.data)
      })
      .catch(err => {
        alert('댓글을 불러오지 못했습니다.');
      });
  };

  //좋아요 불러오기
  const fetchLikes = async () => {
    await axios
      .get(`${URL.SOCIALPOSTS}/${id}/likes`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then(res => {
        setLikes(res.data);
      })
      .catch(err => {
        alert('좋아요를 불러오지 못했습니다.');
      });
  };

  //게시글 작성자 정보
  const fetchAuthor = async () => {
    await axios
      .get(`${URL.USERS}/${post.usersId}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then(res => {
        setAuthor(res.data);
      });
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
    fetchLikes();
  }, [postId]);

  useEffect(() => {
    //console.log(Object.keys(post).length);
    if (Object.keys(post).length > 0) {
      fetchAuthor();
    }
  }, [post]);

  const handleLike = async () => {
    await axios
      .post(`${URL.SOCIALPOSTS}/${id}/likes`, null, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then(res => {
        fetchLikes();
      });
  };

  const handleCommentSubmit = async () => {
    // if (comment.trim()) {
    //   setComments(prev => [...prev, comment]);
    //   setComment('');
    // }
    await axios.post(
      `${URL.SOCIALPOSTS}/${id}/comments`,
      {
        content: comment,
      },
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      },
    );
    fetchComments();
  };

  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      axios
        .delete(`${URL.SOCIALPOSTS}/${postId}`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        })
        .then(() => {
          alert('삭제되었습니다.');
          navigate('/social');
          window.location.reload();
        })
        .catch(() => {
          // console.warn('[개발모드] 서버 없음 - 로컬로 삭제 처리');

          // const stored = localStorage.getItem('posts');
          // const posts = stored ? JSON.parse(stored) : [];

          // const cleanId = id.startsWith('s-') || id.startsWith('l-') ? id.slice(2) : id;

          // const updated = posts.filter(p => String(p.postId) !== String(cleanId));

          // localStorage.setItem('posts', JSON.stringify(updated));

          //alert('삭제되었습니다.');
          //navigate('/social');
          //window.location.reload();
          alert('게시글을 삭제하지 못했습니다.');
        });
    }
  };

  const getImageSrc = img => {
    if (!img) return '';
    if (img.startsWith('blob:')) return img;
    if (img.startsWith('/img/')) return img;
    return `/img/${img}`;
  };

  // 상대 시간 갱신을 위한 더미 state
  const [, tick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => tick(n => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const rtf = useMemo(
    () => new Intl.RelativeTimeFormat('ko', { numeric: 'auto', style: 'short' }),
    [],
  );

  return (
    <>
      <Container className="detail-wrapper">
        <div className="detail-left">
          {/* <h2>상세페이지</h2> */}
          <h3>{post.postTitle}</h3>
          <div className="post-header">
            <div className="author-container">
              <Image style={{ width: '50px', margin: 0 }} src={author?.profileImg} roundedCircle />
              {author?.nickName}
            </div>
            <div className="detail-likes">
              <img src="/img/like.png" alt="like" onClick={handleLike} />
              <span>{likes.likeCount}</span>
            </div>
          </div>
          <hr />

          {post.postImage ? (
            <img src={post.postImage} alt={post.postTitle} />
          ) : (
            <div className="img-placeholder">이미지 없음</div>
          )}

          <p>{post.postContent}</p>
          <hr />

          <div className="comment-box">
            <h4>댓글</h4>
            <div className="comment-input">
              <input
                type="text"
                value={comment}
                placeholder="댓글을 입력하세요"
                onChange={e => setComment(e.target.value)}
              />
              <button onClick={handleCommentSubmit}>등록</button>
            </div>
            <div>
              {comments.length > 0
                ? comments.map((comment, i) => {
                    const then = Date.parse(comment.createdAt);
                    const diffSec = (Date.now() - then) / 1_000;

                    // 단위 결정
                    let val, unit;

                    if (Math.abs(diffSec) < 60) {
                      val = Math.round(-diffSec);
                      unit = 'second';
                    } else if (Math.abs(diffSec / 60) < 60) {
                      val = Math.round(-(diffSec / 60));
                      unit = 'minute';
                    } else if (Math.abs(diffSec / 3600) < 24) {
                      val = Math.round(-(diffSec / 3600));
                      unit = 'hour';
                    } else {
                      val = Math.round(-(diffSec / 86400));
                      unit = 'day';
                    }

                    const label = rtf.format(val, unit).replace(/\s+/g, '');

                    return (
                      <div
                        key={i}
                        style={{
                          padding: '10px',
                          borderBottom: '2px solid #FFD600',
                          borderRadius: '20px',
                          fontFamily: 'Arial, fantasy',
                        }}
                      >
                        <p style={{ fontSize: '15px', color: '#00000096' }}>
                          {comment.userName}
                          <span style={{ fontSize: '12px' }}> . {label}</span>
                        </p>
                        <p style={{ fontSize: '12px' }}>{comment.content}</p>
                      </div>
                    );
                  })
                : '댓글이 없습니다'}
            </div>
          </div>
          <hr />
          <div className="btn-container">
            <div className="btn-wrapper">
              <button className="action-btn" onClick={() => navigate(`/social/create`)}>
                글쓰기
              </button>
              {post.usersId === user.usersId && (
                <button className="action-btn" onClick={() => navigate(`/social/edit/${postId}`)}>
                  수정
                </button>
              )}
              {post.usersId === user.usersId && (
                <button className="action-btn" onClick={handleDelete}>
                  삭제
                </button>
              )}
            </div>
            <button className="action-btn" onClick={() => navigate('/social')}>
              목록
            </button>
          </div>
        </div>
      </Container>
    </>
  );
}
