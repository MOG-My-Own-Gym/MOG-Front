import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './record.css'; // CSS 경로
import 'react-calendar/dist/Calendar.css';

export default function RecordPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('운동');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDateClick = date => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const toggleUpload = () => setShowUpload(prev => !prev);

  const handleFileChange = e => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  {
    /*모달 창 센터*/
  }
  useEffect(() => {
    if (isModalOpen || showUpload) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen, showUpload]);

  return (
    <div className="record-container">
      {/* 탭 선택 */}
      <div className="record-tabs">
        {['운동', '포토', '신체'].map(tab => (
          <button
            key={tab}
            className={`record-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab);
              setShowUpload(false);
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 운동 탭 */}
      {activeTab === '운동' && (
        <>
          <div className="calendar-wrapper">
            <Calendar
              value={selectedDate}
              onChange={setSelectedDate}
              onClickDay={handleDateClick}
              calendarType="iso8601"
              locale="ko-KR"
              formatDay={(locale, date) => date.getDate()}
              formatShortWeekday={(locale, date) =>
                ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
              }
              tileClassName={({ date }) => {
                const day = date.getDay();
                if (day === 0 || day === 6) {
                  return 'weekend'; // 일요일(0) 또는 토요일(6)
                }
                return null;
              }}
              className='my-custom-calendar-record'
            />
          </div>

          <div className="record-labels">
            <span className="dot-label">
              <span className="dot red"></span> 운동 기록
            </span>
            <span className="dot-label">
              <span className="dot green"></span> 사진 기록
            </span>
            <span className="dot-label">
              <span className="dot blue"></span> 신체 기록
            </span>
          </div>
        </>
      )}

      {/* 포토 탭 */}
      {activeTab === '포토' && (
        <div className="photo-tab">
          <div className="photo-header">
            <span>포토 기록</span>
            <button className="photo-add-btn" onClick={toggleUpload}>
              +
            </button>
          </div>

          {showUpload && (
            <div className="modal-overlay" onClick={toggleUpload}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>{selectedDate.toLocaleDateString()} 📷 업로드할 사진/비디오 추가</h3>
                  <button onClick={toggleUpload} className="modal-close-btn">
                    ×
                  </button>
                </div>
                <p>기록 날짜: {selectedDate.toLocaleDateString()}</p>
                <p>
                  공개 설정: <span style={{ color: 'red' }}>비공개</span>
                </p>
                <textarea placeholder="내용을 입력하세요" />

                <div className="button-group">
                  <label htmlFor="fileInput" className="upload-label">
                    첨부하기
                  </label>
                  <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                  <button className="submit-btn">업로드</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 신체 탭 */}
      {activeTab === '신체' && (
        <div className="record-placeholder">📊 신체 기록이 들어가는 자리입니다.</div>
      )}



      {/* 날짜 클릭시 모달 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedDate.toLocaleDateString()} 기록</h3>
              <button onClick={closeModal} className="modal-close-btn">
                ×
              </button>
            </div>

            {/* 운동 기록 섹션 */}
            <div className="record-section">
              <div className="section-title">💪 운동 기록</div>
              <div className="section-content">
                <p className="no-data-text">기록된 운동 정보가 없습니다.</p>
              </div>
            </div>

            {/* 포토 기록 섹션 */}
            <div className="record-section">
              <div className="section-title">📷 포토 기록</div>
              <div className="section-content">
                <p className="no-data-text">🖼️ 기록된 사진이 없습니다.</p>
              </div>
            </div>

            {/* 신체 기록 섹션 */}
            <div className="record-section">
              <div className="section-title">📊 신체 기록</div>
              <div className="section-content">
                <p className="no-data-text">기록된 신체 정보가 없습니다.</p>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-edit">수정</button>
              <button className="btn-delete">삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
