import React, { useState, useEffect, useContext } from 'react';
import './CommentSection.css';
import axios from 'axios';
import { AuthContext } from '../../pages/Login/AuthContext';

function CommentSection({ postId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');

  const {user} = useContext(AuthContext);

  // 목록 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      try {

        const response = await axios.get(`http://localhost:8080/api/v1/posts/${postId}/comments`)
        .then((res)=>{return res.data;})
        const commentData = response;
        setComments(commentData);
        
      } catch (error) {
        console.error("댓글 목록 로딩 실패:", error);
      }
    };
    fetchComments();
  }, [postId]);

 useEffect(() => {
  console.log("postId in CommentSection:", postId);
  console.log(user)
}, [postId]);
  
//댓글 생성
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await axios.post(`http://localhost:8080/api/v1/posts/${postId}/comments`,
      { content: newComment },{ withCredentials: true,headers:{
        Authorization: `Bearer ${user.accessToken}`
      } }
      );
      setComments([response.data,...comments])
      setNewComment("")
    } catch (error) {
      alert(error.response?.data?.message || "댓글 등록 실패");
    }
  };
   //삭제
  const handleDelete = async (commentId) => {
    const confirmed= window.confirm("댓글을 삭제 하시겠습니까?");
    if(!confirmed) return; //
    
    try {
      await axios.delete(`http://localhost:8080/api/v1/posts/${postId}/comments/${commentId}`,
       { withCredentials: true ,headers:{
        Authorization: `Bearer ${user.accessToken}`}}
    );
   setComments((prev) => prev.filter((c) => c.commentId !== commentId));
  } catch (error) {
    alert(error.response?.data?.message || "삭제 실패");
  }
};

  // 수정
  const handleEditClick = (comment) => {
  setEditingCommentId(comment.commentId);
  setEditText(comment.content);
};

const handleUpdateSubmit = async (commentId) => {
  try {
    const res = await axios.put(
      `http://localhost:8080/api/v1/posts/${postId}/comments/${commentId}`,
      { content: editText },
      { withCredentials: true,
        headers: {
          Authorization: `Bearer ${user.accessToken}`
        }
      }
    );

    setComments((prev) =>
      prev.map((c) =>
        c.commentId === commentId ? { ...c, content: res.data.content } : c
      )
    );

    setEditingCommentId(null);
    setEditText("");
  } catch (error) {
    alert(error.response?.data?.message || "수정 실패");
  }
};


  return (
    <div className="comment-section">
      <h4>댓글</h4>
      {currentUser && (
        <div className="comment-form">
          <input className="comment-input" type="text" value={newComment} placeholder="댓글을 입력하세요" onChange={e => setNewComment(e.target.value)} />
          <button className="comment-button" onClick={handleCommentSubmit}>등록</button>
        </div>
      )}
      <ul className="comment-list">
        {comments.map((c) => (
          <li key={c.commentId} className="comment-item">
            {editingCommentId === c.commentId ? (
              <div className="comment-edit-form">
                <input type="text" className="comment-edit-input" value={editText} onChange={(e) => setEditText(e.target.value)} />
                <div className="comment-actions">
                  <button className="comment-action-button save" onClick={() => handleUpdateSubmit(c.commentId)}>저장</button>
                  <button className="comment-action-button cancel" onClick={() => setEditingCommentId(null)}>취소</button>
                </div>
              </div>
            ) : (
              <>
                <div className="comment-content">
                  <strong className="comment-author">{c.userName}</strong>: {c.content}
                  <span className="comment-timestamp">({new Date(c.createdAt).toLocaleString()})</span>
                </div>
                {currentUser && currentUser.id === c.userId && (
                  <div className="comment-actions">
                    <button className="comment-action-button edit" onClick={() => {handleEditClick(c)}}>수정</button>
                    <button className="comment-action-button delete" onClick={() => handleDelete(c.commentId)}>삭제</button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CommentSection;