import { Route, Routes } from "react-router-dom";
import SelectMainpage from "./SelectMainpage";
import CategoryPage from "./CategoryPage";
import RoutinePage from "./RoutinePage";
import RunningRoutinePage from "./RunningRoutinePage";
import RoutineResultPage from "./RoutineResultPage";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { URL } from "../../config/constants";
import Model from "./Model";

const DataToss=()=>{
    const [useDataRoutine,setDataRoutine] = useState();
    const [useDetailExData,setDetailExData] = useState();
    const [initDetailTime,setDetailTime] = useState();//휴식 타이머 시간 값(저장된 값)
    const [routineId,setRoutineId] = useState();
    const [currentDetailId,setCurrentDetailId] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [isCurrentTimeRunning, setIsCurrentRunning] = useState(false);
    const [startRrcodResultData,setStartRrcodResultData] = useState(false);
    const [initMakeRoutine, setMakeRoutine] = useState([]);
    const [checkPageWhenRunningPage,setCheckPageWhenRunningPage] = useState(false);
    const [makeDetailSetData,setMakeDetailSetData] =useState();
    const [subDetailTime,setSubDetailTime]=useState(0); //휴식 타이머 보이는 값
    const [currentRrcodingRoutineId,setCurrentRrcodingRoutineId] = useState(0);
    const [resetTimeCheckBoolean,setResetTimeCheckBoolean]= useState(false);
    const [checkRoutineUser,setCheckRoutineUser] = useState([]);//유저 구분 후 루틴 값
    const [elapsed, setElapsed] = useState(0); // 총 경과 시간 (초)
    const [isRunning, setIsRunning] = useState(false);
    const startTimeRef = useRef(null);
    const intervalRef = useRef(null);
    const localIntervalRef = useRef(null);

    //루틴 값 업데이트 조회
    const fetchData = async () => {
        await axios.get(URL.ROUNTINE)
            .then(res=>setDataRoutine(res.data))
    };

    //루틴 디테일 값 업데이트 조회
    const detailData = async ()=>{
        await axios.get(URL.ROUTINEDETAIL)
            .then(res=>setDetailExData(res.data))
    }
    
    // 타이머 시작
    const startTimer = () => {
        if (!isRunning) {
            startTimeRef.current = Date.now() - elapsed * 1000; // 기존 경과 반영
            intervalRef.current = setInterval(() => {
                const now = Date.now();
                const diff = Math.floor((now - startTimeRef.current) / 1000);
                setElapsed(diff);
            }, 1000);
            setIsRunning(true);
        }
    };

    // 타이머 정지
    const pauseTimer = () => {
        if (isRunning) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        }
    };

    // 타이머 초기화
    const resetTimer = () => {
        clearInterval(intervalRef.current);
        setElapsed(0);
        setIsRunning(false);
        startTimeRef.current = null;
    };

    // 휴식 타이머 시작
    const startLocalTimer = () => {
        setIsCurrentRunning(true);
        localIntervalRef.current = setInterval(() => {
        setSubDetailTime(prev =>{
            if(prev <= 0) resetLocalTimer()
            return prev === 0?initDetailTime:prev - 1
            });
        }, 1000);
    }

    //휴식 타이머 정지
    const stopLocalTimer = () => {
        if(isCurrentTimeRunning){
            clearInterval(localIntervalRef.current);
            setIsCurrentRunning(false);
        }
    }

    //휴식 타이머 초기화
    const resetLocalTimer = () => {
        clearInterval(localIntervalRef.current); //휴식 타이머 초기화
        setSubDetailTime(initDetailTime); //휴식 시간 값 업데이트
        setIsCurrentRunning(false); //
        localIntervalRef.current = null; //clearInterval 안의 함수 삭제
    }
   
    // 시간 포맷(시,분,초)
    const formatTime = () => {
        const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
        const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
        const s = String(elapsed % 60).padStart(2, '0');
        if (elapsed < 60) return `${s}s`;
        if (elapsed < 3600) return `${m}:${s}`;
        return `${h}:${m}:${s}`;
    };

    // 언마운트 시 타이머 정리(휴식 시간 포함)
    useEffect(() => {
       return () =>{ 
            clearInterval(localIntervalRef.current); //타이머
            clearInterval(intervalRef.current); //휴식 타이머
        }
    }, []);

    //시간 값 변경 시 휴식 타이머 업데이트
    useEffect(()=>{
        if(!isCurrentTimeRunning) setSubDetailTime(initDetailTime);
    },[initDetailTime])

    return <>
        {isOpen&&<Model 
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
        />}
        <Routes>
            <Route path="" element={<SelectMainpage 
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
                />}>
            </Route>
            <Route path="/select" element={<CategoryPage 
                useDataRoutine={useDataRoutine} 
                fetchData={fetchData} 
                detailData={detailData} 
                useDetailExData={useDetailExData}
                checkRoutineUser={checkRoutineUser}
                />}>
            </Route>
            <Route path="/routine" element={<RoutinePage 
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
                />}>
            </Route>
            <Route path="/runningroutine" element={<RunningRoutinePage 
                setDetailTime={setDetailTime} 
                setCurrentDetailId={setCurrentDetailId}
                setIsOpen={setIsOpen}
                setIsCurrentRunning={setIsCurrentRunning}
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
                />}>  
            </Route>
            <Route path="/routineresult" element={<RoutineResultPage />}></Route>
        </Routes>
    </>

};
export default DataToss;