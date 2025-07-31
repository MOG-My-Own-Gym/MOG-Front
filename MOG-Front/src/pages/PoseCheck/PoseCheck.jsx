import React, { useRef, useState, useEffect } from "react";
import "./PoseCheck.css";
import { Pose } from "@mediapipe/pose";
import { Camera as MpcCamera } from "@mediapipe/camera_utils";

// Teachable Machine에서 훈련된 모델 주소
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/itfRMB9Zw/";

export default function PoseCheck() {

  const webcamRef = useRef(null); // 화면에 웹캠을 표시할 div
  const animationRef = useRef(null); // requestAnimationFrame 참조
  const runningRef = useRef(false); // 분석 루프 실행 여부
  const webcamInstance = useRef(null); // 웹캠과 Mediapipe Pose 객체 저장
  const mpLandmarksRef = useRef(null); // Mediapipe의 포즈 결과 저장

  
  const [isRunning, setIsRunning] = useState(false); // 분석 중 여부
  const [predictions, setPredictions] = useState([]); // Teachable Machine 예측 결과
  const [feedbackMessage, setFeedbackMessage] = useState(""); // 피드백 메시지
  const [accuracyScore, setAccuracyScore] = useState(null); // 정확도 점수
  const [history, setHistory] = useState([]); // 이전 기록
  const [stableClass, setStableClass] = useState(null); // 안정된 자세 클래스
  const predictionQueue = useRef([]); // 최근 예측들을 저장해서 안정된 class 추출

  // Mediapipe Pose 설정
  useEffect(() => {
    const mpPose = new Pose({
      locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${f}`,
    });

    mpPose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    // Mediapipe에서 결과를 받으면 landmarks 저장
    mpPose.onResults((results) => {
      mpLandmarksRef.current = results.poseLandmarks;
    });

    // mpPose 객체 저장
    webcamInstance.current = { mpPose };
  }, []);

  // 컴포넌트가 사라질 때 정리 작업
  useEffect(() => {
    return () => {
      runningRef.current = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      const video = webcamInstance.current?.cam?.video;
      if (video?.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // 날짜 포맷: "7월 31일 (수)" 형식으로 출력
  const formatDateToKorean = () => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const d = new Date();
    return `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
  };

  // 포인트 유효성 검사
  const isValid = (pt) => pt && typeof pt.x === "number" && typeof pt.y === "number";

  // 세 점(A, B, C)으로 각도 계산
  const calculateAngle = (A, B, C) => {
    if (!isValid(A) || !isValid(B) || !isValid(C)) return null;
    const rad = Math.atan2(C.y - B.y, C.x - B.x) - Math.atan2(A.y - B.y, A.x - B.x);
    let deg = Math.abs((rad * 180) / Math.PI);
    return deg > 180 ? 360 - deg : deg;
  };

  // 자세에 따라 정확도 평가
  const analyzeAccuracy = (landmarks, className) => {
    const avg = (a, b) => (a + b) / 2;
    const norm = className.trim().toLowerCase();
    let msg = "", score = null;

    // 기본자세는 분석하지 않음
    if (norm === "upright posture") {
      setFeedbackMessage("자세 분석 대기 중...");
      setAccuracyScore(null);
      return;
    }

    // 사용할 포인트의 인덱스 정의
    const idx = {
      leftShoulder: 11, leftElbow: 13, leftWrist: 15,
      rightShoulder: 12, rightElbow: 14, rightWrist: 16,
      leftHip: 23, leftKnee: 25, leftAnkle: 27,
      rightHip: 24, rightKnee: 26, rightAnkle: 28
    };
    const get = (name) => landmarks?.[idx[name]] ?? null;

    // 각도 계산
    let a1 = null, a2 = null;
    if (norm === "barbell biceps curl") {
      a1 = calculateAngle(get("leftShoulder"), get("leftElbow"), get("leftWrist"));
      a2 = calculateAngle(get("rightShoulder"), get("rightElbow"), get("rightWrist"));
    } else if (norm === "lateral raise") {
      a1 = calculateAngle(get("leftHip"), get("leftShoulder"), get("leftElbow"));
      a2 = calculateAngle(get("rightHip"), get("rightShoulder"), get("rightElbow"));
    } else if (norm === "romanian deadlift") {
      a1 = calculateAngle(get("leftShoulder"), get("leftHip"), get("leftKnee"));
    } else if (norm === "squat") {
      a1 = calculateAngle(get("leftHip"), get("leftKnee"), get("leftAnkle"));
      a2 = calculateAngle(get("rightHip"), get("rightKnee"), get("rightAnkle"));
    }

    // 정확도 판단 기준
    if (["barbell biceps curl", "lateral raise", "squat"].includes(norm)) {
      if (a1 == null || a2 == null) {
        setFeedbackMessage("자세 포인트를 인식하지 못했습니다.");
        setAccuracyScore(null);
        return;
      }
      const v = avg(a1, a2);
      if (norm === "barbell biceps curl") {
        [msg, score] = v < 50 ? ["최고예요! 팔이 충분히 접혔어요.", 95]
          : v < 90 ? ["좋아요! 좀 더 조여도 돼요.", 80]
          : ["팔을 더 접어보세요.", 60];
      } else if (norm === "lateral raise") {
        [msg, score] = (v > 80 && v < 100) ? ["어깨 높이가 딱 좋아요!", 95]
          : (v > 60 && v < 120) ? ["조금 더 수평에 가깝게 해보세요.", 80]
          : ["팔을 더 수평으로 들어올려 보세요.", 60];
      } else {
        [msg, score] = v > 140 ? ["좋은 스쿼트! 무릎을 충분히 굽혔어요.", 95]
          : v > 120 ? ["거의 좋아요. 좀 더 내려보세요.", 80]
          : ["스쿼트가 충분히 깊지 않아요.", 60];
      }
    } else if (norm === "romanian deadlift") {
      if (a1 == null) {
        setFeedbackMessage("자세 포인트를 인식하지 못했습니다.");
        setAccuracyScore(null);
        return;
      }
      [msg, score] = a1 > 160 ? ["좋은 자세예요! 등을 곧게 유지했어요.", 95]
        : a1 > 140 ? ["거의 좋아요. 등을 좀 더 곧게 해보세요.", 80]
        : ["등이 너무 굽었어요. 조심하세요!", 60];
    }

    // 결과 저장
    setFeedbackMessage(msg);
    setAccuracyScore(score);
  };

  // 분석 루프: Teachable Machine 예측 + Mediapipe 각도 계산
  const loop = async (tmModel, cam) => {
    if (!runningRef.current) return;
    cam.update();

    const { pose, posenetOutput } = await tmModel.estimatePose(cam.canvas);
    const preds = await tmModel.predict(posenetOutput);
    const best = preds.reduce((a, b) => a.probability > b.probability ? a : b);

    setPredictions(preds);

    // 안정적인 class 판단
    predictionQueue.current.push(best.className);
    if (predictionQueue.current.length > 20) predictionQueue.current.shift();

    const counts = {};
    predictionQueue.current.forEach(c => counts[c] = (counts[c] || 0) + 1);
    const [top, freq] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || [];
    if (freq >= 12 && top !== "upright posture") setStableClass(top);

    // 정확도 분석
    const mpLandmarks = mpLandmarksRef.current;
    if (mpLandmarks) analyzeAccuracy(mpLandmarks, best.className);

    // 다음 루프 요청
    animationRef.current = requestAnimationFrame(() => loop(tmModel, cam));
  };

  // 분석 시작
  const startAnalysis = async () => {
    const video = document.createElement("video");
    video.setAttribute("playsinline", "");
    video.width = 300;
    video.height = 300;

    // 카메라 권한 요청
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 300, height: 300 },
      audio: false
    });
    video.srcObject = stream;
    await video.play();

    webcamRef.current.innerHTML = "";
    webcamRef.current.appendChild(video);

    const tmModel = await window.tmPose.load(
      MODEL_URL + "model.json",
      MODEL_URL + "metadata.json"
    );

    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;

    const cam = {
      video,
      canvas,
      update: () => {
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
    };

    const mpPose = webcamInstance.current.mpPose;

    // Mediapipe 실행 시작
    new MpcCamera(video, {
      onFrame: async () => {
        cam.update();
        await mpPose.send({ image: canvas });
      },
      width: 300,
      height: 300,
    }).start();

    webcamInstance.current.cam = cam;

    runningRef.current = true;
    setIsRunning(true);
    loop(tmModel, cam);
  };

  // 분석 종료
  const stopAnalysis = () => {
    runningRef.current = false;
    setIsRunning(false);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const video = webcamInstance.current?.cam?.video;
    if (video?.srcObject) {
      video.srcObject.getTracks().forEach((track) => track.stop());
    }

    webcamRef.current.innerHTML = "";

    // 기록 저장
    let record = stableClass;
    if (!record && predictions.length) {
      record = predictions.reduce((a, b) => a.probability > b.probability ? a : b).className;
    }
    if (record) {
      const prob = predictions.find(p => p.className === record)?.probability || 0;
      setHistory(prev => [
        { date: formatDateToKorean(), className: record, probability: (prob * 100).toFixed(1) },
        ...prev.slice(0, 9)
      ]);
    }
  };

  return (
    <>
      <h2 className="pose-page-title">자세 분석 결과</h2>
      <div className="pose-wrapper">
        <div className="pose-webcam-wrapper">
          <div className="pose-webcam" ref={webcamRef} />
          {!isRunning && (
            <div className="pose-overlay">분석 시작을 눌러 시작해보세요</div>
          )}
        </div>

        <div className="pose-feedback-static">
          <h2 className="pose-feedback-title">정확도 분석</h2>
          {(feedbackMessage || accuracyScore != null) && (
            <div className="feedback-box">
              <p>{feedbackMessage}</p>
              {accuracyScore != null && <p>정확도 점수: {accuracyScore}%</p>}
            </div>
          )}
        </div>

        <div className="pose-history">
          <h3>지난 기록</h3>
          <ul>
            {history.map((h, i) => (
              <li key={i}>{h.date} - {h.className} ({h.probability}%)</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pose-bottom">
        <div className="pose-buttons">
          {!isRunning
            ? <button className="pose-button" onClick={startAnalysis}>분석 시작</button>
            : <button className="pose-button" onClick={stopAnalysis}>분석 종료</button>
          }
        </div>
        <div className="pose-bars">
          {predictions.map(p => (
            <div key={p.className} className="bar-item">
              <span className="bar-label">{p.className}</span>
              <div className="bar-track">
                <div
                  className={`bar-fill ${p.className === stableClass ? "best" : ""}`}
                  style={{ width: `${(p.probability * 100).toFixed(1)}%` }}
                />
              </div>
              <span className="bar-percent">{(p.probability * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
