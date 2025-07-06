import React from "react";

export default function PhotoRecordCard({ rec, idx }) {
  return (
    <div className="photo-record-card" key={idx}>
      <img
        src={rec.previews[0]}
        alt={`record-${idx}`}
        className="record-thumb"
        onClick={() => window.open(rec.previews[0], "_blank")}
      />
      <div className="record-info">
        <p className="record-date">{rec.date.toLocaleDateString()}</p>
        <p className="record-privacy">{rec.privacy}</p>
        <p className="record-text">{rec.text}</p>
      </div>
    </div>
  );
}
