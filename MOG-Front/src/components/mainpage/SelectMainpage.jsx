import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../assets/bootstrap/css/mainpage.module.css";
import "../../assets/bootstrap/css/bootstrap.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../../config/constants";

export default function SelectMainpage({useDataRoutine,fetchData}){
    const navigate = useNavigate();
    const [useRoutineState,setRoutineState] = useState([]);
    useEffect(()=>{
        console.log('useDataRoutine1:',useDataRoutine);    
        fetchData();
    },[])

    const deleteRoutine= async (e) => {
        e.stopPropagation();
        //const lastS = e.target.id.charAt(e.target.id.length - 1);
        //console.log('lastS:',lastS);
        await axios.delete(`${URL.ROUNTINE}/${e.target.id}`)
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
             <button key={index} className={`${styles.containers} btn btn-lg btn-primary`} 
             style={{width:'100%', fontSize:'25px', textAlign:'left',display:'flex'}}
             type="button" 
             onClick={()=>navigate(`/data/routine?routineId=${useDataRoutine[index].id}`)}>
               {item.name}
               <a style={{marginLeft:'auto'}} href="#" id={item.id} onClick={e=>deleteRoutine(e)}>...</a>
            </button>
            ))
            :
            <h1>추가 필요</h1>    
            }
            
        </div>
        <div className={`${styles.dummyContainers} p-5 mt-4`}></div>
        <footer className={`${styles.flexButton}`}>
            <button className={`${styles.buttonSize} btn btn-lg btn-primary`} type="button" onClick={e=>navigate("/data/select",{state:true})} >루틴 생성</button>
            <button className={`${styles.buttonSize} btn btn-lg btn-primary`} type="button">루틴 삭제</button>
        </footer>
    </div>
    </>
}