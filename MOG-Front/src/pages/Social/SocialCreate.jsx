import './SocialCreate.css';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../Login/AuthContext';

export default function SocialCreate() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [img, setImg] = useState(null);

  const handleCreate = e => {
    e.preventDefault();
    const createPost = async () => {
      await axios
        .post(`http://localhost:8080/api/v1/posts`, newPost, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        })
        .then(res => {
          navigate('/social');
        });
    };

    const newPost = {
      postId: Date.now(), // 고유 ID
      postTitle: title,
      postContent: content,
      postImage: img,
      userId: user.usersId || 0,
    };
    createPost();
    //const storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    //localStorage.setItem('posts', JSON.stringify([newPost, ...storedPosts]));
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
        <textarea placeholder="내용" value={content} onChange={e => setContent(e.target.value)} />
        <input
          type="file"
          accept="image/*"
          onChange={e => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();

              reader.onloadend = function () {
                const base64String = reader.result; // data:image/png;base64,... 형태
                setImg(base64String);
              };

              reader.readAsDataURL(file);
            }
          }}
        />
        <button type="submit">작성 완료</button>
      </form>
    </div>
  );
}
