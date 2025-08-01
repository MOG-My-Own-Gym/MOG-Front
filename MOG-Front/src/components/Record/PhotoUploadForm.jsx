import React from "react";

export default function PhotoUploadForm({
  selectedDate,
  privacy,
  text,
  fileNames,
  onPrivacyChange,
  onTextChange,
  onFileChange,
  onUpload,
  onCancel
}) {
  return (
    <div className="upload-form">
      <button className="back-btn" onClick={onCancel}>←</button>
      <p>📷 업로드할 사진/비디오 추가</p>

      <div className="form-row">
        <label>기록 날짜:</label>
        <span>{selectedDate.toLocaleDateString()}</span>
      </div>

      <div className="form-row">
        <label>공개 설정:</label>
        <label>
          <input
            type="radio"
            name="privacy"
            value="비공개"
            checked={privacy === "비공개"}
            onChange={() => onPrivacyChange("비공개")}
          /> 비공개
        </label>
        <label>
          <input
            type="radio"
            name="privacy"
            value="공개"
            checked={privacy === "공개"}
            onChange={() => onPrivacyChange("공개")}
          /> 공개
        </label>
      </div>

      <textarea
        placeholder="내용을 입력하세요"
        value={text}
        onChange={onTextChange}
      />

      <div className="button-group">
        <label htmlFor="fileInput" className="upload-label">첨부하기</label>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          multiple
          onChange={onFileChange}
          style={{ display: "none" }}
        />
        <button className="submit-btn" onClick={onUpload}>업로드</button>
      </div>

      {fileNames.length > 0 && (
        <ul className="file-list">
          {fileNames.map((n, i) => (
            <li key={i}>• {n}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
