import React, { useRef, useEffect, useState } from "react";
import "./PoseCheck.css";

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/itfRMB9Zw/";

function PoseCheck() {
  const webcamRef = useRef(null);
  const isRunningRef = useRef(false); // loop 제어용
  const [model, setModel] = useState(null);
  const [webcam, setWebcam] = useState(null);
  const [isRunning, setIsRunning] = useState(false); // UI용

  const [predictions, setPredictions] = useState([]);
  const [predictionQueue, setPredictionQueue] = useState([]);
  const [stableClass, setStableClass] = useState(null);
  const [history, setHistory] = useState([]);

  // 날짜 포맷
  const formatDateToKorean = () => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = days[date.getDay()];
    return `${month}월 ${day}일 (${weekday})`;
  };

  // 분석 시작
  const startAnalysis = async () => {
    const loadedModel = await tmPose.load(
      MODEL_URL + "model.json",
      MODEL_URL + "metadata.json"
    );
    const cam = new tmPose.Webcam(300, 300, true);
    await cam.setup();
    await cam.play();

    // 이전 캔버스 제거 (중복 제거)
    const existingCanvas = webcamRef.current.querySelector("canvas");
    if (existingCanvas && webcamRef.current.contains(existingCanvas)) {
      webcamRef.current.removeChild(existingCanvas);
    }

    webcamRef.current.appendChild(cam.canvas);

    setModel(loadedModel);
    setWebcam(cam);
    setIsRunning(true);
    isRunningRef.current = true;

    // 분석 루프
    const loop = async () => {
      if (!cam || !loadedModel || !isRunningRef.current) return;

      cam.update();
      const { pose, posenetOutput } = await loadedModel.estimatePose(cam.canvas);
      const prediction = await loadedModel.predict(posenetOutput);

      if (prediction.length > 0) {
        setPredictions(prediction);

        const best = prediction.reduce((a, b) =>
          a.probability > b.probability ? a : b
        );

        setPredictionQueue((prev) => {
          const updated = [...prev, best.className];
          if (updated.length > 20) updated.shift();
          return updated;
        });
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  };

  // 분석 종료
  const stopAnalysis = () => {
    if (webcam) webcam.stop();
    setIsRunning(false);
    isRunningRef.current = false;
    setPredictions([]);
    setPredictionQueue([]);

    // 기록 저장
    if (stableClass) {
      const best = predictions.find((p) => p.className === stableClass);
      if (best) {
        setHistory((prev) => [
          {
            date: formatDateToKorean(),
            className: best.className,
            probability: (best.probability * 100).toFixed(1),
          },
          ...prev.slice(0, 9),
        ]);
      }
    }

    setStableClass(null);
  };

  // className 안정화 (20개 중 16개 이상)
  useEffect(() => {
    if (predictionQueue.length < 5) return;

    const counts = {};
    predictionQueue.forEach((cls) => {
      counts[cls] = (counts[cls] || 0) + 1;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const [topClass, freq] = sorted[0];

    if (freq >= 16) {
      setStableClass(topClass);
    }
  }, [predictionQueue]);

  return (
    <>
      <h2 className="pose-page-title">자세 분석 결과</h2>

      <div className="pose-wrapper">
        <div className="pose-left">
          <div className="pose-webcam" ref={webcamRef}>
            {!isRunning && !webcam && (
              <div className="pose-overlay">분석 시작을 눌러주세요</div>
            )}
            {!isRunning && webcam && (
              <div className="pose-overlay">분석이 종료되었습니다<br />기록을 확인해주세요</div>
            )}
          </div>

          <div className="pose-buttons">
            {!isRunning ? (
              <button className="pose-button" onClick={startAnalysis}>
                분석 시작
              </button>
            ) : (
              <button className="pose-button" onClick={stopAnalysis}>
                분석 종료
              </button>
            )}
          </div>

          <div className="pose-bars">
            {predictions.map((p) => (
              <div key={p.className} className="bar-item">
                <span className="bar-label">{p.className}</span>
                <div className="bar-track">
                  <div
                    className={`bar-fill ${p.className === stableClass ? "best" : ""}`}
                    style={{ width: `${(p.probability * 100).toFixed(1)}%` }}
                  ></div>
                </div>
                <span className="bar-percent">{(p.probability * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pose-history">
          <h3>지난 기록</h3>
          <ul>
            {history.map((h, i) => (
              <li key={i}>
                {h.date} - {h.className} ({h.probability}%)
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default PoseCheck;
