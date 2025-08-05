import React, { useRef, useState, useEffect } from "react";
import "./PoseCheck.css";
import { Pose } from "@mediapipe/pose";
import { Camera as MpcCamera } from "@mediapipe/camera_utils";

// Teachable Machine 모델 경로
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/itfRMB9Zw/";

export default function PoseCheck() {
  // 웹캠, 애니메이션, 실행 상태 관련 ref
  const webcamRef = useRef(null);
  const animationRef = useRef(null);
  const runningRef = useRef(false);
  const webcamInstance = useRef(null);
  const mpLandmarksRef = useRef(null);

  // 정확도 저장 및 피드백 제한 시간용 ref
  const accuracyHistory = useRef([]);
  const lastFeedbackTimeRef = useRef(0);
  const lastClassRef = useRef(null);
  const FEEDBACK_HOLD_MS = 1500; // 피드백 유지 시간(ms)

  const [isRunning, setIsRunning] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [accuracyScore, setAccuracyScore] = useState(null);
  const [history, setHistory] = useState([]);
  const [stableClass, setStableClass] = useState(null);
  const predictionQueue = useRef([]);

  // Mediapipe Pose 초기화
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

    mpPose.onResults((results) => {
      mpLandmarksRef.current = results.poseLandmarks;
    });

    webcamInstance.current = { mpPose };
  }, []);

  // 컴포넌트 unmount 시 리소스 정리
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

  // 날짜를 "7월 31일 (수)" 형식으로 변환
  const formatDateToKorean = () => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const d = new Date();
    return `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
  };

  // 각도 계산을 위한 포인트 유효성 검사
  const isValid = (pt) => pt && typeof pt.x === "number" && typeof pt.y === "number";

  // 세 점을 이용하여 관절 각도를 계산
  const calculateAngle = (A, B, C) => {
    if (!isValid(A) || !isValid(B) || !isValid(C)) return null;
    const rad = Math.atan2(C.y - B.y, C.x - B.x) - Math.atan2(A.y - B.y, A.x - B.x);
    let deg = Math.abs((rad * 180) / Math.PI);
    return deg > 180 ? 360 - deg : deg;
  };

  // 운동 종류에 따른 정확도 분석
  const analyzeAccuracy = (landmarks, className) => {
    const avg = (a, b) => (a + b) / 2;
    const norm = className.trim().toLowerCase();
    let msg = "", score = null;

    // 이전 피드백과 동일하면 일정 시간 동안 갱신 안 함
    const now = Date.now();
    if (norm === lastClassRef.current && now - lastFeedbackTimeRef.current < FEEDBACK_HOLD_MS) return;
    lastClassRef.current = norm;
    lastFeedbackTimeRef.current = now;

    // 기본 자세는 분석 제외
    if (norm === "upright posture") {
      setFeedbackMessage("자세 분석 대기 중...");
      setAccuracyScore(null);
      return;
    }

    // 포인트 인덱스 매핑
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

    // 정확도 메시지와 점수 설정
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

    setFeedbackMessage(msg);
    setAccuracyScore(score);
    accuracyHistory.current.push(score);
  };

  // 분석 루프
  const loop = async (tmModel, cam) => {
    if (!runningRef.current) return;
    cam.update();

    const { pose, posenetOutput } = await tmModel.estimatePose(cam.canvas);
    const preds = await tmModel.predict(posenetOutput);
    const best = preds.reduce((a, b) => a.probability > b.probability ? a : b);

    setPredictions(preds);

    // 안정된 클래스 판단
    predictionQueue.current.push(best.className);
    if (predictionQueue.current.length > 20) predictionQueue.current.shift();

    const counts = {};
    predictionQueue.current.forEach(c => counts[c] = (counts[c] || 0) + 1);
    const [top, freq] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || [];
    if (freq >= 12 && top !== "upright posture") setStableClass(top);

    // Mediapipe 정확도 분석
    const mpLandmarks = mpLandmarksRef.current;
    if (mpLandmarks) analyzeAccuracy(mpLandmarks, best.className);

    animationRef.current = requestAnimationFrame(() => loop(tmModel, cam));
  };

  // 분석 시작, 모델 로딩 및 카메라 연결
  const startAnalysis = async () => {
    const video = document.createElement("video");
    video.setAttribute("playsinline", "");
    video.width = 300;
    video.height = 300;

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

    // Mediapipe에서 프레임 처리 시작
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

  // 분석 종료: 리소스 해제 및 결과 기록
  const stopAnalysis = () => {
    runningRef.current = false;
    setIsRunning(false);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const video = webcamInstance.current?.cam?.video;

    if (video?.srcObject) {
      video.srcObject.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn("트랙 정지 실패:", e);
        }
      });
      video.srcObject = null;
    }

    if (video) {
      try {
        video.pause();
        video.removeAttribute("src");
        video.load();
        video.parentNode?.removeChild(video);
      } catch (e) {
        console.warn("비디오 정리 실패:", e);
      }
    }

    webcamRef.current.innerHTML = "";

    // 가장 안정적인 클래스 기록 저장
    let record = stableClass;
    if (!record && predictions.length) {
      record = predictions.reduce((a, b) => a.probability > b.probability ? a : b).className;
    }

    const scores = accuracyHistory.current;
    const avgAccuracy = scores.length
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
      : null;

    if (record && avgAccuracy != null) {
      setHistory(prev => [
        { date: formatDateToKorean(), className: record, probability: avgAccuracy },
        ...prev.slice(0, 9)
      ]);
    }

    accuracyHistory.current = [];
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
        <p className="pose-history-description">
          최근 일정 시간동안 가장 안정적으로 인식된 동작입니다
        </p>
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