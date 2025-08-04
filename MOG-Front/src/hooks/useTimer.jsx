// hooks/useTimer.js
import { useState, useEffect, useRef } from 'react';

export default function useTimer(defaultInitDetailTime = 60, defaultSubDetailTime = 60) {
  const [routineId, setRoutineId] = useState(0);
  const [makeDetailSetData, setMakeDetailSetData] = useState();
  const [startRrcodResultData, setStartRrcodResultData] = useState(false);
  const [currentRrcodingRoutineId, setCurrentRrcodingRoutineId] = useState(routineId);
  const [initDetailTime, setInitDetailTime] = useState(defaultInitDetailTime);
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [booleanSaveTime,setBooleanSaveTime] = useState(false);
  const [subDetailTime, setSubDetailTime] = useState(defaultSubDetailTime);
  const [isCurrentTimeRunning, setIsCurrentRunning] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const localIntervalRef = useRef(null);

  const startTimer = () => {
    if (!isRunning) {
      startTimeRef.current = Date.now() - elapsed * 1000;
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const diff = Math.floor((now - startTimeRef.current) / 1000);
        setElapsed(diff);
      }, 1000);
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setElapsed(0);
    setIsRunning(false);
    startTimeRef.current = null;
  };

  const startLocalTimer = () => {
    setBooleanSaveTime(true);
    setIsCurrentRunning(true);
    localIntervalRef.current = setInterval(() => {
      setSubDetailTime(prev => {
        if (prev <= 0) resetLocalTimer();
        return prev === 0 ? initDetailTime : prev - 1;
      });
    }, 1000);
  };

  const stopLocalTimer = () => {
    clearInterval(localIntervalRef.current);
    setIsCurrentRunning(false);
  };

  const resetLocalTimer = () => {
    clearInterval(localIntervalRef.current);
    localIntervalRef.current = null;
    setSubDetailTime(initDetailTime);
    setIsCurrentRunning(false);
    setBooleanSaveTime(false);
  };

  const formatTime = () => {
    const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
    const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
    const s = String(elapsed % 60).padStart(2, '0');
    if (elapsed < 60) return `${s}s`;
    if (elapsed < 3600) return `${m}:${s}`;
    return `${h}:${m}:${s}`;
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(localIntervalRef.current);
    };
  }, []);

  return {
    isRunning,
    elapsed,
    subDetailTime,
    setSubDetailTime,
    initDetailTime,
    setInitDetailTime,
    startTimer,
    pauseTimer,
    resetTimer,
    startLocalTimer,
    stopLocalTimer,
    resetLocalTimer,
    formatTime,
    startRrcodResultData,
    setStartRrcodResultData,
    currentRrcodingRoutineId,
    setCurrentRrcodingRoutineId,
    makeDetailSetData,
    setMakeDetailSetData,
    isCurrentTimeRunning,
    booleanSaveTime
  };
}
