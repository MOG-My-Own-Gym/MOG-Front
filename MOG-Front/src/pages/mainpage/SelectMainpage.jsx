import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../assets/bootstrap/css/mainpage.module.css";
import "../../assets/bootstrap/css/bootstrap.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../../config/constants";
import MainRrcodResultTime from "./MainRrcodResultTime";
import { Button } from "react-bootstrap";

export default function SelectMainpage({
        useDataRoutine,
        fetchData,
        startRrcodResultData,
        currentRrcodingRoutineId,
        formatTime,
        pauseTimer,
        startTimer,
        elapsed,
        isRunning,
        setIsOpen,
        setResetTimeCheckBoolean
    }){

    const navigate = useNavigate();
    useEffect(()=>{ 
        fetchData();
    },[])

    const deleteRoutine= async (e) => {
        e.stopPropagation();
        await axios.delete(`${URL.ROUNTINE}/${e.target.id}`)
        await axios.delete(`${URL.ROUTINEDETAIL}/${e.target.id}`)
        fetchData();
    }
    return<>
    <div className={"container mt-5 p-3"}></div>
    <div className={`${styles.mainpage} container mt-0 p-0`}>
        <div className={"container mt-0 p-0"}>
            {
            useDataRoutine!==undefined
            ?
            useDataRoutine.map((item,index)=>(
             <Button key={index} className={`${styles.containers} btn btn-lg ${currentRrcodingRoutineId===item.id?"btn-warning":"btn-primary"}  `} 
             style={{width:'100%', fontSize:'25px', textAlign:'left',display:'flex'}}
             type="button" 
             onClick={()=>navigate(`/data/routine?routineId=${useDataRoutine[index].id}`)}>
               {item.name}
               <a style={{marginLeft:'auto'}} href="#" id={item.id} onClick={e=>deleteRoutine(e)}>...</a>
            </Button>
            ))
            :
            <h1>추가 필요</h1>    
            }
            
        </div>
        <div className={`${styles.dummyContainers} p-5 mt-4`}></div>
        {startRrcodResultData===false?
        <footer className={`${styles.flexButton}`}>
            <button className={`${styles.buttonSize} btn btn-lg btn-dark`} type="button" onClick={e=>navigate("/data/select",{state:true})} >루틴 생성</button>
        </footer>
        :
        startRrcodResultData&&<MainRrcodResultTime
                formatTime={formatTime}
                pauseTimer={pauseTimer}
                startTimer={startTimer}
                elapsed={elapsed}
                isRunning={isRunning}
                setIsOpen={setIsOpen}
                setResetTimeCheckBoolean={setResetTimeCheckBoolean}
        />
        }
    </div>
    </>
}