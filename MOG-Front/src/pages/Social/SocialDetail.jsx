import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import './SocialDetail.css';
import GNB from '../../components/GNB/GNB';
import LikeButton from '../../components/LikeButton/LikeButton';
import CommentSection from '../../components/CommentSection/CommentSection';
import axios from 'axios';
import { AuthContext } from '../Login/AuthContext';

export default function SocialDetail() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const postId = id;

  // Post 데이터, 로딩, 에러 상태를 관리할 state
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // 임시 현재 사용자 정보 (테스트용)
  // 실제로는 Context API나 Redux 등에서 로그인 정보를 가져와야 합니다.
  const currentUser = { id: 1, name: '테스트유저' };

  // useEffect를 사용해 서버에서 post 데이터를 가져옵니다.
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      // 팀원이 만든 Post 상세 정보 조회 API입니다.
      const token = localStorage.getItem('jwtToken');
      const response = await axios
        .get(`http://158.180.78.252:8080/api/v1/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        })
        .then(res => {
          console.log(res.data);
          setPost(res.data); // 성공 시 state에 데이터 저장
          setIsLoading(false);
        })
        .catch(err => {
          if (err) setError(err);
        });
    };

    fetchPost();
  }, [postId]); // postId가 바뀔 때마다 데이터를 다시 가져옵니다.

  // 로딩 및 에러 상태에 따른 UI 처리
  if (isLoading) return <div>로그인후 이용가능 합니다</div>;
  if (error) return <div>에러: {error}</div>;
  if (!post) return <div>게시물이 없습니다.</div>;

  //성공적으로 데이터를 가져왔을 때 보여줄 최종 UI
  return (
    <>
      <div className="black-navbar">
        <GNB />
      </div>
      <div className="detail-wrapper">
        <div className="detail-left">
          <h2>상세페이지</h2>
          <p>게시글 ID: {postId}</p>

          <img src={post.postImage} alt={post.postTitle} />
          <h3>{post.postTitle}</h3>
          <p>{post.postContent}</p>

          <LikeButton
            postId={postId}
            currentUser={currentUser}
            initialLikeCount={post.likeCount || 0}
          />
        </div>

        <CommentSection postId={postId} currentUser={currentUser} />
      </div>
    </>
  );
}
