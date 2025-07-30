import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export default function SocialCreate() {
  const [form, setForm] = useState({
    postTitle: "",
    postContent: "",
    postImage: ""
  });
  const navigate = useNavigate();
  const userId = 1; // 🟡 임시 로그인 사용자 (Postman으로 할 경우 대체 가능)

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    const newPost = {
      userId,
      postTitle: form.postTitle,
      postContent: form.postContent,
      postImage: form.postImage
    };

    // 백엔드 POST 요청 (실제 서버 붙으면 활성화)
    axios.post(`/api/v1/posts`, newPost,{
      withCredentials: true
      })
      .then(() => {
        alert("등록되었습니다.");
        navigate("/social");
      })
      .catch(err => {
        console.error("서버 에러:", err); 
        console.warn("[개발모드] 서버 없음 - 로컬로 저장");

        // 기존 목록 가져오기
        const stored = localStorage.getItem("posts");
        const posts = stored ? JSON.parse(stored) : [];

        // 새로운 글 등록
        const nextId = posts.length > 0 ? Math.max(...posts.map(p => p.postId)) + 1 : 1;
        const savedPost = {
          postId: nextId,
          ...newPost
        };

        const updated = [...posts, savedPost];
        localStorage.setItem("posts", JSON.stringify(updated));

        alert("등록되었습니다. (로컬 처리)");
        navigate("/social");
      });
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>게시글 작성</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="postTitle"
          placeholder="제목"
          value={form.postTitle}
          onChange={handleChange}
        /><br /><br />
        <textarea
          name="postContent"
          placeholder="내용"
          value={form.postContent}
          onChange={handleChange}
        /><br /><br />
        <input
          name="postImage"
          placeholder="이미지 URL"
          value={form.postImage}
          onChange={handleChange}
        /><br /><br />
        <button type="submit">등록</button>
      </form>
    </div>
  );
}
