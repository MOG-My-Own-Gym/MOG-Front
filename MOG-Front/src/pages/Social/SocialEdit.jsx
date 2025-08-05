import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import './SocialCreate.css';
import { AuthContext } from '../Login/AuthContext';
import axios from 'axios';

export default function SocialEdit() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState({});
  // const [title, setTitle] = useState('');
  // const [content, setContent] = useState('');
  // const [img, setImg] = useState('');

  // ✅ 기존 게시글 불러오기
  useEffect(() => {
    //const posts = JSON.parse(localStorage.getItem('posts')) || [];
    //const strippedId = id.replace(/^l-/, '');

    //const post = posts.find(p => p.postId?.toString() === strippedId);
    // if (post) {
    //   setTitle(post.postTitle || '');
    //   setContent(post.postContent || '');
    //   setImg(post.postImage || '');
    // } else {
    //   console.warn('해당 ID의 게시글을 찾을 수 없습니다.');
    // }

    const getPost = async () => {
      await axios
        .get(`https://mogapi.kro.kr/api/v1/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        })
        .then(res => {
          setPost(res.data);
        });
    };
    getPost();
  }, [id]);

  // ✅ 수정 완료 핸들러
  const handleEdit = e => {
    e.preventDefault(); // 폼 제출 기본 동작 막기

    // const updatedPosts = storedPosts.map(p => {
    //   if (p.postId?.toString() === strippedId) {
    //     return {
    //       ...p,
    //       postTitle: title,
    //       postContent: content,
    //       postImage: img,
    //     };
    //   }
    //   return p;
    // });

    const updatePost = async () => {
      await axios.put(`https://mogapi.kro.kr/api/v1/posts/${id}`, post, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
    };
    updatePost();
    //localStorage.setItem('posts', JSON.stringify(updatedPosts));
    navigate('/social'); // 수정 후 목록으로 이동
  };

  // ✅ 이미지 파일을 base64 문자열로 변환하는 함수
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPost(prev => {
          return { ...prev, postImage: reader.result };
        }); // base64 문자열 저장
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {post && (
        <div className="create-wrapper">
          <h2>게시글 수정</h2>
          <form onSubmit={handleEdit} className="create-form">
            <input
              type="text"
              placeholder="제목"
              value={post.postTitle}
              onChange={e =>
                setPost(prev => {
                  return { ...prev, postTitle: e.target.value };
                })
              }
            />
            <textarea
              placeholder="내용"
              value={post.postContent}
              onChange={e =>
                setPost(prev => {
                  return { ...prev, postContent: e.target.value };
                })
              }
            />
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {post.postImage && (
              <img
                src={post.postImage}
                alt="미리보기"
                style={{ maxWidth: '100%', marginTop: '1em', borderRadius: '8px' }}
              />
            )}
            <button type="submit">수정 완료</button>
          </form>
        </div>
      )}
    </>
  );
}
