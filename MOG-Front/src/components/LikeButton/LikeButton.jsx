import React, { useState, useContext } from 'react';
import './LikeButton.css';
import axios from 'axios';
import { AuthContext } from '../../pages/Login/AuthContext';

function LikeButton({ postId, initialLikeCount }) {
  const { user } = useContext(AuthContext);

  const [likes, setLikes] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await axios.post(
        `https://mogapi.kro.kr/api/v1/posts/${postId}/likes`,
        null,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      );
      setLikes(response.data.likeCount);
      setIsLiked(response.data.isLiked);
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  return (
    <div className="like-button-container" onClick={handleLike}>
      <span className="like-button-icon">{isLiked ? '❤️' : '🤍'}</span>
      <span className="like-button-count">{likes}</span>
    </div>
  );
}

export default LikeButton;
