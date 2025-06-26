import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./record.css";

export default function RecordPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("운동");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true); // 팝업 열기
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="record-container">
      <header className="record-header">기록</header>

      <div className="record-tabs">
        {["운동", "포토", "신체"].map((tab) => (
          <button
            key={tab}
            className={`record-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "운동" && (
        <>
          <div className="calendar-wrapper">
           
            <Calendar
              value={selectedDate}
              onChange={setSelectedDate}
              onClickDay={handleDateClick}
              calendarType="gregory"
              locale="ko-KR"
              formatDay={(locale, date) => date.getDate()}
              showNeighboringMonth={false}
            />
          </div>

          <div className="record-labels">
            <span style={{ display: "inline-flex", alignItems: "center" }}>
              <span className="dot red"></span> 운동 기록
            </span>
            <span style={{ display: "inline-flex", alignItems: "center" }}>
              <span className="dot green"></span> 사진 기록
            </span>
            <span style={{ display: "inline-flex", alignItems: "center" }}>
              <span className="dot blue"></span> 신체 기록
            </span>
          </div>
        </>
      )}

      {activeTab === "포토" && (
        <div className="record-placeholder">
          📷 사진 기록이 들어가는 자리입니다.
        </div>
      )}

      {activeTab === "신체" && (
        <div className="record-placeholder">
          📊 신체 기록이 들어가는 자리입니다.
        </div>
      )}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedDate.toLocaleDateString()} 기록</h3>
            <p>여기에 운동/포토/신체 기록 정보가 표시될 예정입니다.</p>
            <button onClick={closeModal} className="modal-close">
              닫기
            </button>
          </div>
     </div>
  )}
    </div> // record-container 닫기
  );
}
