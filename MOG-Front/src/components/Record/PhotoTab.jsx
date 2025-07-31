import React from "react";
import PhotoUploadForm from "./PhotoUploadForm";
import PhotoRecordCard from "./PhotoRecordCard";
import './css/PhotoTab.css';


export default function PhotoTab({
  selectedDate,
  privacy,
  text,
  fileNames,
  showUpload,
  photoRecords,
  onTextChange,
  onPrivacyChange,
  onFileChange,
  onUpload,
  toggleUpload
}) {
  return (
    <div className="photo-tab">
      <div className="photo-header">
        <h3>포토 기록</h3>
        <button className="photo-add-btn" onClick={toggleUpload}>＋</button>
      </div>

      {showUpload && (
        <PhotoUploadForm
          selectedDate={selectedDate}
          privacy={privacy}
          text={text}
          fileNames={fileNames}
          onPrivacyChange={onPrivacyChange}
          onTextChange={(e) => onTextChange(e.target.value)}
          onFileChange={onFileChange}
          onUpload={onUpload}
          onCancel={toggleUpload}
        />
      )}

      {photoRecords.length > 0 && (
        <div className="photo-records-grid">
          {photoRecords.map((rec, idx) => (
            <PhotoRecordCard key={idx} rec={rec} idx={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
