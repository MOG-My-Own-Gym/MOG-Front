import React from "react";
import "./css/ModalPopup.css";

export default function ModalPopup({ date, onClose }) {
  const formattedDate = date
    ? `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`
    : "기록";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{formattedDate} 기록갯수</h2>
        <p>여기에 운동/포토/신체 기록 정보가 표시될 예정입니다.</p>
        <button className="close-button" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
