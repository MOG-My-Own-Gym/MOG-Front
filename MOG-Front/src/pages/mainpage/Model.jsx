import { useEffect, useState } from "react";
import { URL } from "../../config/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Model({
        closeModal,
        routineId,
        initMakeRoutine,
        setStartRrcodResultData,
        checkPageWhenRunningPage,
        setMakeDetailSetData,
        setCurrentRrcodingRoutineId,
        startTimer,
        startRrcodResultData,
        resetTimer,
        reset,
        setResetTimeCheckBoolean,
        resetTimeCheckBoolean
    }){
    const [getRoutineLength,setRoutineLength] = useState();
    const navigate = useNavigate();
    /*
    const loadRoutineDetail=async ()=>{
        closeModal();
        await axios.post(URL.ROUTINERESULT,{
            "id": routineId,
            "retId": String(getRoutineLength+1),
            "tStart": new Date(),
            "tEnd": new Date(),
            "routineEndDetails": []
        })
        setStartRrcodResultData(true);
        if(!checkPageWhenRunningPage){
            navigate(`/data/runningroutine?routineId=${routineId}&DetailId=1`,{state:initMakeRoutine})
        }
    }*/
    const loadRoutineDetail=()=>{
        localStorage.removeItem("detailSetData");    
        localStorage.setItem("detailSetData",JSON.stringify({
            "id": String(getRoutineLength+1),
            "retId": routineId,
            "tStart": new Date(),
            "tEnd": new Date(),
            "routineEndDetails": []
        }));
        setMakeDetailSetData(JSON.parse(localStorage.getItem("detailSetData")))
        setStartRrcodResultData(true);
        setCurrentRrcodingRoutineId(routineId);
        startTimer();
        if(!checkPageWhenRunningPage){
            navigate(`/data/runningroutine?routineId=${routineId}&DetailId=1`,{state:initMakeRoutine})
        }
    }
    const stopRrcodResultData=()=>{
        if(!resetTimeCheckBoolean){
            const resultData = JSON.parse(localStorage.getItem("detailSetData"));
            const inputResult = {...resultData,tEnd: new Date(),
                "routineResult": { 
                    "muscle": "28", 
                    "kcal": "230", 
                    "reSet": "2", 
                    "setNum": "4", 
                    "volum": "1000", 
                    "rouTime": "38", 
                    "exVolum": "980" 
                }
            }
            axios.post(URL.ROUTINERESULT,{
                ...inputResult
            })
            .then(localStorage.removeItem("detailSetData"))
            setStartRrcodResultData(false);
            setCurrentRrcodingRoutineId(0);
            resetTimer();
            reset();
            navigate(`/data/routineresult`,{state:inputResult});
        }else{
            localStorage.removeItem("detailSetData")
            setStartRrcodResultData(false);
            setCurrentRrcodingRoutineId(0);
            resetTimer();
            reset();
            setResetTimeCheckBoolean(false);
        }
    }
    useEffect(()=>{
        axios.get(URL.ROUTINERESULT)
            .then(res=>setRoutineLength(res.data.length));
    },[])
    return<>
        <div className="modal-overlay" tabIndex="-1" onClick={closeModal}>
            <div className="modal-dialog">
                <div className="modal-content" style={{backgroundColor:'white'}}>
                    <div className="modal-header">
                        <h5 className="modal-title">루틴 설정</h5>
                    </div>
                    <div className="modal-body">
                        <p>{startRrcodResultData?"운동을 종료 하시겠습니까?":"운동을 시작하시겠습니까?"}</p>
                        <p>{resetTimeCheckBoolean?"클릭 시 저장한 데이터는 사라집니다.":""}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" 
                            onClick={e=>startRrcodResultData?stopRrcodResultData():loadRoutineDetail()}>
                                {startRrcodResultData?"종료":"시작"}</button>
                        <button type="button" className="btn btn-primary" onClick={closeModal}>취소</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}
export default Model;