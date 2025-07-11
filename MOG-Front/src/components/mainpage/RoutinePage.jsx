import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../assets/bootstrap/css/mainpage.module.css";
import "../../assets/bootstrap/css/bootstrap.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { URL } from "../../config/constants";

export default function RoutinePage({useDataRoutine}){
    const navigate = useNavigate();
    const [initMakeRoutine, setMakeRoutine] = useState([]);
    const makeRoutineBoxRef = useRef();
    const {search } = useLocation();
    const params = search.slice(-1);
    const [deleteEx,setDeleteEx] = useState();

    const routineDetailButton=(e)=>{
        e.stopPropagation();
        console.log('initMakeRoutine:',initMakeRoutine);

    }
    const deleteRoutine=async (e)=>{
         e.stopPropagation();
        //const lastS = e.target.id.charAt(e.target.id.length - 1);
        //console.log('lastS:',lastS);
        //await axios.put(`${URL.ROUNTINE}/${location.state}/`,{})
        //            .then()
        //await axios.delete(`${URL.ROUNTINE}/${lastS}`)
        //fetchData();
        console.log('루틴 페이지 location.state2:',params);
        console.log('운동 삭제 버튼 이벤트 ID:',e.target.id);
        const deleteSaveData = initMakeRoutine.filter(item=>(item.set_id!==e.target.id));
        console.log('initMakeRoutine.set_id:',deleteSaveData);
        console.log('루틴 페이지 useDataRoutine:',useDataRoutine);
        await axios.put(`${URL.ROUNTINE}/${params}/`,{id:String(useDataRoutine[params-1].id),name:useDataRoutine[params-1].name,state:[...deleteSaveData]})
                    .then(res=>console.log('운동 삭제 결과 값:%o',res));
        setMakeRoutine(deleteSaveData);
        
    }

    useEffect(()=>{
        //setMakeRoutine([...location.state]);
        axios.get(URL.ROUNTINE)
            .then(res=> setMakeRoutine(res.data[params-1].state))
            //.then(res=> console.log(res.data[location.state-1].state))
        console.log('initMakeRoutine:',initMakeRoutine);
        console.log('루틴 페이지 location.state1:',params);
    },[])
    return<>
        <div className={"container mt-5 p-3"}></div>
        <button className={`btn btn-lg btn-primary`} type="button" onClick={()=>navigate('/data/')}>뒤로가기</button>
        <div className={`${styles.mainpage} container mt-0 p-0`}>
                <div ref={makeRoutineBoxRef} className={"container mt-0 p-0"}>
                    {
                    initMakeRoutine.map((item,index)=>
                    <button key={index} className="btn btn-lg btn-dark"  id={item.names}
                            style={{width:'100%', fontSize:'25px', textAlign:'left',display:'flex'}}  
                            type="button" onClick={e=>routineDetailButton(e)}>
                            <img alt={item.imgfile} style={{width:'100px'}} src={item.imgfile}/>
                            {item.names}
                            <a style={{marginLeft:'auto'}} href="#" id={item.set_id} onClick={e=>deleteRoutine(e)}>...</a>
                       </button>
                    )
                    }             
                </div>
            <div className={`${styles.dummyContainers} p-5 mt-4`}></div>
            <footer className={`${styles.flexButton}`}>
                <button className={`${styles.buttonSize} btn btn-lg btn-primary`} type="button" onClick={(e)=>{navigate("/data/runningroutine");e.target.value=='운동 완료'?e.target.value='운동 시작':e.target.value='운동 완료';}}>운동 시작</button>
                <button className={`${styles.buttonSize} btn btn-lg btn-primary`} type="button" onClick={()=>navigate("/data/select",{state:params})}>운동 추가</button>
            </footer>
        </div>

    </>
}