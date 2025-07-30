import './SocialCreate.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SocialCreate() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [img, setImg] = useState(null);

  const handleCreate = e => {
    e.preventDefault();

    const newPost = {
      postId: Date.now(), // 고유 ID
      postTitle: title,
      postContent: content,
      postImage: img,
      userId: JSON.parse(localStorage.getItem('user'))?.usersId || 0,
    };

    const storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    localStorage.setItem('posts', JSON.stringify([newPost, ...storedPosts]));
    navigate('/social');
  };

  return (
    <div className="create-wrapper">
      <h2>📝 새 게시글 작성</h2>
      <form onSubmit={handleCreate} className="create-form">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          placeholder="내용"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
       <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImg(imageUrl);
    }
  }}
/>
        <button type="submit">작성 완료</button>
      </form>
    </div>
  );
}