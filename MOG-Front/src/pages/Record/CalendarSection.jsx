import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import './css/CalendarSection.css';

import ModalPopup from "./ModalPopup"; // 기존 팝업
import MusclePopup from "./MusclePopup"; // 새로 만든 사용근육 팝업

export default function CalendarSection() {
  const [viewMode, setViewMode] = useState("count"); // count or muscle
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCountModalOpen, setIsCountModalOpen] = useState(false);
  const [isMuscleModalOpen, setIsMuscleModalOpen] = useState(false);

  const toggleView = () => {
    setViewMode(prev => (prev === "count" ? "muscle" : "count"));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    if (viewMode === "count") {
      setIsCountModalOpen(true);
    } else {
      setIsMuscleModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsCountModalOpen(false);
    setIsMuscleModalOpen(false);
  };

  return (
    <>
      <div className="calendar-wrapper">
        <div className="calendar-container">
          <Calendar
            tileClassName={({ date, view }) => {
              if (view !== "month") return null;
              if (date.getDay() === 0) return "tile-sunday";
              if (date.getDay() === 6) return "tile-saturday";
              return null;
            }}
            onClickDay={handleDateClick}
            value={selectedDate}
            calendarType="gregory"
            locale="ko-KR"
            formatDay={(locale, date) => date.getDate()}
            showNeighboringMonth={false}
            formatMonthYear={(locale, date) => `${date.getMonth() + 1}월`}
            next2Label={null}
            prev2Label={null}
            minDetail="year"
          />

          {/* ⬅ 기록갯수 / 사용근육 우측 토글 */}
          <div className="calendar-toggle-group">
            <button onClick={toggleView}>&lt;</button>
            <span className="calendar-toggle-label">
              {viewMode === "count" ? "기록갯수" : "사용근육"}
            </span>
            <button onClick={toggleView}>&gt;</button>
          </div>
        </div>
      </div>

      {/* ⬇️ 하단 레이블 */}
      {viewMode === "count" ? (
        <div className="record-labels">
          <span className="dot-label"><span className="dot red" /> 운동 기록</span>
          <span className="dot-label"><span className="dot green" /> 사진 기록</span>
          <span className="dot-label"><span className="dot blue" /> 신체 기록</span>
        </div>
      ) : (
        <div className="record-labels">
          <span className="dot-label"><span className="dot red" /> 가슴</span>
          <span className="dot-label"><span className="dot green" /> 등</span>
          <span className="dot-label"><span className="dot blue" /> 어깨</span>
          <span className="dot-label"><span className="dot orange" /> 하체</span>
          <span className="dot-label"><span className="dot lightgreen" /> 팔</span>
          <span className="dot-label"><span className="dot purple" /> 코어</span>
        </div>
      )}

      {/* 📌 모달 팝업 조건부 렌더링 */}
      {isCountModalOpen && (
        <ModalPopup date={selectedDate} onClose={closeModal} />
      )}
      {isMuscleModalOpen && (
        <MusclePopup date={selectedDate} onClose={closeModal} />
      )}
    </>
  );
}
