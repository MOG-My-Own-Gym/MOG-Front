import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SocialEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    postTitle: "",
    postContent: "",
    postImage: ""
  });

  // 기존 글 불러오기
  useEffect(() => {
    // 🟡 서버에서 불러올 경우
    axios.get(`/api/v1/posts/${id}`)
      .then(res => {
        setForm({
          postTitle: res.data.postTitle,
          postContent: res.data.postContent,
          postImage: res.data.postImage
        });
      })
      .catch(() => {
        // 🔧 서버 없을 경우 → localStorage에서 불러오기
        console.warn("[개발모드] 서버 없음 - 로컬에서 불러옴");

        const stored = localStorage.getItem("posts");
        const posts = stored ? JSON.parse(stored) : [];
        const target = posts.find(p => String(p.postId) === String(id));
        if (target) {
          setForm({
            postTitle: target.postTitle,
            postContent: target.postContent,
            postImage: target.postImage
          });
        }
      });
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    // 백엔드 요청 시도
    axios.put(`/api/v1/posts/${id}`, form)
      .then(() => {
        alert("수정 완료!");
        navigate(`/social/${id}`);
      })
      .catch(() => {
        // 로컬 업데이트
        console.warn("[개발모드] 서버 없음 - 로컬에서 수정");

        const stored = localStorage.getItem("posts");
        const posts = stored ? JSON.parse(stored) : [];

        const updated = posts.map(p =>
          String(p.postId) === String(id)
            ? { ...p, ...form }
            : p
        );

        localStorage.setItem("posts", JSON.stringify(updated));
        alert("수정 완료! (로컬 처리)");
        navigate(`/social/${id}`);
      });
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>게시글 수정</h2>
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
        <button type="submit">수정 완료</button>
      </form>
    </div>
  );
}
