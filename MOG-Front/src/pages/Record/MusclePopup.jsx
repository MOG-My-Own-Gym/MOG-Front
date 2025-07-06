import React from "react";
import './css/MusclePopup.css'; // ✅ 요거로 경로 바꿔줘야 함

export default function MusclePopup({ date, onClose }) {
  const formattedDate = date
    ? `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`
    : "";

  return (
    <div className="muscle-modal-overlay" onClick={onClose}>
      <div className="muscle-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{formattedDate} 사용근육</h2>
        <p>여기에 가슴/등/어깨/하체/팔/코어 관련 기록이 표시될 예정입니다.</p>
        <button className="muscle-close-button" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}
