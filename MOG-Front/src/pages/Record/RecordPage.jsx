// 📄 src/pages/Record/RecordPage.jsx
import React, { useState, useEffect } from 'react';
import CalendarSection from './CalendarSection';
import BodyTab from './BodyTab';
import ModalPopup from './ModalPopup';
import 'react-calendar/dist/Calendar.css';
import './css/record-common.css';
import PhotoTab from './PhotoTab';

export default function RecordPage() {
  // ── 기본 상태 ──
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('운동');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── 포토 업로드 상태 ──
  const [showUpload, setShowUpload] = useState(false);
  const [text, setText] = useState('');
  const [privacy, setPrivacy] = useState('비공개');
  const [tempFiles, setTempFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  // ── 저장된 포토 레코드 ──
  const [photoRecords, setPhotoRecords] = useState([]);

  // ── 핸들러 ──
  const handleDateClick = date => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const switchTab = tab => {
    setActiveTab(tab);
    setShowUpload(false);
  };

  const toggleUpload = () => {
    if (!showUpload) {
      setText('');
      setPrivacy('비공개');
      setTempFiles([]);
      setFileNames([]);
      setPreviewUrls([]);
    }
    setShowUpload(prev => !prev);
  };

  const handleFileChange = e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setTempFiles(prev => [...prev, ...files]);
    setFileNames(prev => [...prev, ...files.map(f => f.name)]);
    e.target.value = '';
  };

  const handleUpload = () => {
    if (tempFiles.length === 0) return;
    const urls = tempFiles.map(f => URL.createObjectURL(f));
    setPreviewUrls(urls);
    setPhotoRecords(prev => [
      ...prev,
      { date: selectedDate, privacy, text, previews: urls, names: fileNames },
    ]);
    setShowUpload(false);
  };

  useEffect(() => {
    return () => previewUrls.forEach(u => URL.revokeObjectURL(u));
  }, [previewUrls]);

  return (
    <div className="record-container">
      <header className="record-header">기록</header>

      {/* 탭 네비 */}
      <div className="record-tabs">
        {['운동', '포토', '신체'].map(tab => (
          <button
            key={tab}
            className={`record-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => switchTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 운동 탭 */}
      {activeTab === '운동' && (
        <CalendarSection selectedDate={selectedDate} onDateClick={handleDateClick} />
      )}

      {/* 포토 탭 */}
      {activeTab === '포토' && (
        <PhotoTab
          selectedDate={selectedDate}
          privacy={privacy}
          text={text}
          fileNames={fileNames}
          showUpload={showUpload}
          photoRecords={photoRecords}
          onTextChange={setText}
          onPrivacyChange={setPrivacy}
          onFileChange={handleFileChange}
          onUpload={handleUpload}
          toggleUpload={toggleUpload}
        />
      )}

      {/* 신체 탭 */}
      {activeTab === '신체' && <BodyTab />}

      {/* 날짜 모달 */}
      {isModalOpen && <ModalPopup selectedDate={selectedDate} closeModal={closeModal} />}
    </div>
  );
}
