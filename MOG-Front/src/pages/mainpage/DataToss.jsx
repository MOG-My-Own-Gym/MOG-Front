import { Route, Routes } from 'react-router-dom';
import SelectMainpage from './SelectMainpage';
import CategoryPage from './CategoryPage';
import RoutinePage from './RoutinePage';
import RunningRoutinePage from './RunningRoutinePage';
import RoutineResultPage from './RoutineResultPage';
import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { URL } from '../../config/constants';
import Model from './Model';
import { RoutineContext } from '../../context/RoutineContext';

const DataToss = () => {
  const [useDataRoutine, setDataRoutine] = useState();
  const [useDetailExData, setDetailExData] = useState();
  const [routineId, setRoutineId] = useState();
  const [currentDetailId, setCurrentDetailId] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [initMakeRoutine, setMakeRoutine] = useState([]);
  const [checkPageWhenRunningPage, setCheckPageWhenRunningPage] = useState(false);
  const [resetTimeCheckBoolean, setResetTimeCheckBoolean] = useState(false);
  const [checkRoutineUser, setCheckRoutineUser] = useState([]); //유저 구분 후 루틴 값
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);
  const localIntervalRef = useRef(null);

  const {
    isRunning,
    elapsed,
    startTimer,
    pauseTimer,
    resetTimer,
    subDetailTime,
    startLocalTimer,
    stopLocalTimer,
    resetLocalTimer,
    formatTime,
    setSubDetailTime,
    initDetailTime,
    setInitDetailTime,
    currentRrcodingRoutineId,
    setCurrentRrcodingRoutineId,
    startRrcodResultData,
    setStartRrcodResultData,
    makeDetailSetData,
    setMakeDetailSetData,
    isCurrentTimeRunning,
    booleanSaveTime
  } = useContext(RoutineContext);
  //루틴 값 업데이트 조회
  const fetchData = async () => {
    await axios.get(URL.ROUNTINE).then(res => setDataRoutine(res.data));
  };

  //루틴 디테일 값 업데이트 조회
  const detailData = async () => {
    await axios.get(URL.ROUTINEDETAIL).then(res => setDetailExData(res.data));
  };

  // 언마운트 시 타이머 정리(휴식 시간 포함)
  useEffect(() => {
    return () => {
      clearInterval(localIntervalRef.current); //타이머
      clearInterval(intervalRef.current); //휴식 타이머
    };
  }, []);

  //시간 값 변경 시 휴식 타이머 업데이트
  useEffect(() => {
    if (!isCurrentTimeRunning) setSubDetailTime(initDetailTime);
  }, [initDetailTime]);

  return (
    <>
      {isOpen && (
        <Model
          setIsOpen={setIsOpen}
          routineId={routineId}
          initMakeRoutine={initMakeRoutine}
          setStartRrcodResultData={setStartRrcodResultData}
          checkPageWhenRunningPage={checkPageWhenRunningPage}
          setMakeDetailSetData={setMakeDetailSetData}
          setCurrentRrcodingRoutineId={setCurrentRrcodingRoutineId}
          startTimer={startTimer}
          startRrcodResultData={startRrcodResultData}
          resetTimer={resetTimer}
          setResetTimeCheckBoolean={setResetTimeCheckBoolean}
          resetTimeCheckBoolean={resetTimeCheckBoolean}
          elapsed={elapsed}
          resetLocalTimer={resetLocalTimer}
        />
      )}
      <Routes>
        <Route
          path=""
          element={
            <SelectMainpage
              useDataRoutine={useDataRoutine}
              fetchData={fetchData}
              startRrcodResultData={startRrcodResultData}
              currentRrcodingRoutineId={currentRrcodingRoutineId}
              formatTime={formatTime}
              pauseTimer={pauseTimer}
              startTimer={startTimer}
              isRunning={isRunning}
              setIsOpen={setIsOpen}
              setResetTimeCheckBoolean={setResetTimeCheckBoolean}
              setCheckRoutineUser={setCheckRoutineUser}
              checkRoutineUser={checkRoutineUser}
            />
          }
        ></Route>
        <Route
          path="/select"
          element={
            <CategoryPage
              useDataRoutine={useDataRoutine}
              fetchData={fetchData}
              detailData={detailData}
              useDetailExData={useDetailExData}
              checkRoutineUser={checkRoutineUser}
            />
          }
        ></Route>
        <Route
          path="/routine"
          element={
            <RoutinePage
              useDataRoutine={useDataRoutine}
              fetchData={fetchData}
              detailData={detailData}
              useDetailExData={useDetailExData}
              startRrcodResultData={startRrcodResultData}
              setIsOpen={setIsOpen}
              setMakeRoutine={setMakeRoutine}
              initMakeRoutine={initMakeRoutine}
              setCheckPageWhenRunningPage={setCheckPageWhenRunningPage}
              setRoutineId={setRoutineId}
              currentRrcodingRoutineId={currentRrcodingRoutineId}
            />
          }
        ></Route>
        <Route
          path="/runningroutine"
          element={
            <RunningRoutinePage
              setInitDetailTime={setInitDetailTime}
              setCurrentDetailId={setCurrentDetailId}
              setIsOpen={setIsOpen}
              startRrcodResultData={startRrcodResultData}
              setMakeDetailSetData={setMakeDetailSetData}
              makeDetailSetData={makeDetailSetData}
              currentRrcodingRoutineId={currentRrcodingRoutineId}
              formatTime={formatTime}
              initDetailTime={initDetailTime}
              routineId={routineId}
              currentDetailId={currentDetailId}
              isCurrentTimeRunning={isCurrentTimeRunning}
              setSubDetailTime={setSubDetailTime}
              subDetailTime={subDetailTime}
              startLocalTimer={startLocalTimer}
              resetLocalTimer={resetLocalTimer}
              stopLocalTimer={stopLocalTimer}
              booleanSaveTime={booleanSaveTime}
            />
          }
        ></Route>
        <Route path="/routineresult" element={<RoutineResultPage />}></Route>
      </Routes>
    </>
  );
};
export default DataToss;
