import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../assets/bootstrap/css/mainpage.module.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { URL } from "../../config/constants";
import SetTime from "./SetTime";
import { Button } from "react-bootstrap";

export default function RunningRoutinePage({
        setDetailTime,
        setCurrentDetailId,
        setIsOpen,
        setIsCurrentRunning,
        startRrcodResultData,
        setMakeDetailSetData,
        makeDetailSetData,
        currentRrcodingRoutineId,
        formatTime,
        currentDetailId,
        isCurrentTimeRunning,
        setSubDetailTime,
        subDetailTime,
        startLocalTimer,
        resetLocalTimer,
        stopLocalTimer
    }){

    const navigate = useNavigate();
    const {search } = useLocation();
    const params = new URLSearchParams(search);
    const routineId = params.get('routineId'); 
    const detailId = params.get('DetailId');  
    const [initDetail,setDetail] = useState([]);
    const [showDetail,setshowDetail] = useState([]);
    const [addSetState,setAddState] = useState([]);
    const [nextPrevNum,setNextPrevNum] = useState(parseInt(detailId));
    const [isDisabledLeft,setIsDisabledLeft] = useState(false);
    const [isDisabledRight,setIsDisabledRight] = useState(false);
    const [checkRouData,setCheckRouData] = useState([]);
    const refWeight = useRef();
    const refMany = useRef();

    const loadRoutineDetail=async ()=>{
        await axios.get(`${URL.ROUTINEDETAIL}/${routineId}`)
        .then(res=> {setDetail(()=>{
            setshowDetail(res.data.state.filter(item=>item.id===detailId));
            if(detailId===String(res.data.state.length))setIsDisabledRight(true);
            if(detailId-1===0)setIsDisabledLeft(true);
            return res.data.state;
        }
        ); return res;})
        .then(res=> setCheckRouData(res.data))
    }
   
    const exSendResultData=(e)=>{
        if(e.target.dataset.id==="complete"){
            setIsCurrentRunning(true);
            resetLocalTimer();
            startLocalTimer();
            e.target.dataset.id="cancel";
            e.target.classList.add('btn-primary');
            setMakeDetailSetData(res=>{
                res.routineEndDetails.push({
                "srName": showDetail[0].names, 
                "setNumber": e.target.id, 
                "reps": addSetState[parseInt(e.target.id)-1].weight, 
                "weight": addSetState[parseInt(e.target.id)-1].many
            })
            localStorage.setItem('detailSetData',JSON.stringify(res));
            return JSON.parse(localStorage.getItem("detailSetData"));
            })
        }else{
            e.target.dataset.id="complete";
            e.target.classList.remove("btn-primary");
            setMakeDetailSetData(res=>{
                res.routineEndDetails = 
                    res.routineEndDetails.filter(item=>
                        !(item.setNumber===e.target.id && item.srName===showDetail[0].names)
                    );
                localStorage.setItem('detailSetData',JSON.stringify(res));
                return JSON.parse(localStorage.getItem("detailSetData"));
            })
        }
    }
    const showEnableCheckBox=()=>{
        const elements = document.querySelectorAll("[data-class]");
        elements.forEach(el => {
            const dateSet = el.dataset.class;
            el.classList.remove("btn-primary");
            el.dataset.id="complete";
            makeDetailSetData.routineEndDetails.forEach(ro=>{
                if(dateSet===ro.setNumber && ro.srName === showDetail[0].names){
                    el.classList.add('btn-primary');
                    el.dataset.id="cancel";
                }
            })
           
        });
         
    }
    const nextAndPrevExButton =(e)=>{
        e.preventDefault();
        setNextPrevNum(prev=>{
            if(e.target.id==="next"){
                const updated = prev +1;
                nextPrevButtonData(updated-1);
                setshowDetail([initDetail[updated-1]]);
                return updated;
            }
            else{
                const updated = prev -1;
                nextPrevButtonData(updated-1);
                setshowDetail([initDetail[updated-1]]);
                return updated;
            }
        })
    }
    const nextPrevButtonData=(updated)=>{
        if(updated===0)setIsDisabledLeft(true);
        if(updated===initDetail.length -1)setIsDisabledRight(true);
        if(updated!==0)setIsDisabledLeft(false);
        if(updated!==initDetail.length -1)setIsDisabledRight(false);
    }
    const addAndRemoveExSet=(e)=>{
        setAddState(prev=>{
            const addSet =[{id:String(addSetState.length+1),weight: "10", many: "1"}]
            const removeSet = addSetState.filter(item=>item.id !== String(addSetState.length))
            const arrayEx= [...prev,...addSet];
            const fixDeatilData =  initDetail.map(item=>{
                if(item.id===String(nextPrevNum)){
                    return {
                        ...item,
                        set:e.target.id==="add"?[...arrayEx]:[...removeSet]
                    }
                }
                return item;
                });
            axios.put(`${URL.ROUTINEDETAIL}/${routineId}`,{
                id:checkRouData.id,
                state:[...fixDeatilData]
            })
            .then(res=>setDetail(res.data.state));
            return e.target.id==="add"?arrayEx:removeSet;
        }); 
        if(e.target.id!=="add"&&startRrcodResultData){
            setMakeDetailSetData(res=>{
                res.routineEndDetails = 
                    res.routineEndDetails.filter(item=>
                        item.srName===showDetail[0].names && item.setNumber!==String(addSetState.length)
                    );
                localStorage.setItem('detailSetData',JSON.stringify(res));
                return JSON.parse(localStorage.getItem("detailSetData"));
            })
        }
    }
    const fixKgAndManyNum=(e)=>{
        e.target.value<=0?e.target.value=e.target.placeholder:e.target.value;
        //!e.target.value?e.target.value=e.target.placeholder:e.target.value;
        const fixDeatilData =  initDetail.map(item=>{
            if(item.id===String(nextPrevNum)){
                return {
                    ...item,
                    set:item.set.map(setItem=>
                        setItem.id===String(e.target.id)?
                        e.target.dataset.id==="weight"?
                        {...setItem,weight:e.target.value}:
                        {...setItem,many:e.target.value}:
                        setItem
                    )
                }
            }
            return item;
        });
        axios.put(`${URL.ROUTINEDETAIL}/${routineId}`,{
            id:checkRouData.id,
            state:[...fixDeatilData]
        })
        .then(res=>{setDetail(res.data.state); return res.data.state})
        .then(res=>setAddState(res[nextPrevNum-1].set))
        e.target.value = '';
    }
    
    const checkExResult=(e)=>{
        if(!startRrcodResultData){
            setIsOpen(true);
        }
        else{
            exSendResultData(e);
        }
    }
    
    useEffect(()=>{
        loadRoutineDetail();
        setCurrentDetailId(nextPrevNum);
    },[]);
    useEffect(()=>{   
        if(startRrcodResultData) showEnableCheckBox();
    },[addSetState]);
    
    useEffect(()=>{   
        setCurrentDetailId(nextPrevNum);
    },[nextPrevNum]);
   useEffect(()=>{
        if(showDetail.length!==0){
            setAddState(showDetail[0].set);
            setDetailTime(showDetail[0].lest);
        }
    },[showDetail])

    return<>
        <div className={styles.mainContainer}>
            <Button className={`btn btn-lg btn-danger m-2`} type="button" onClick={()=>navigate(-1)}>뒤로가기</Button>
            <span style={{fontSize:'25px'}}>{startRrcodResultData?formatTime():""}</span>
            <div className={`${styles.mainpage} container mt-0 p-0`}>
                {showDetail.map((item,index)=>(
                    <div key={index} className={` container d-grid gap-2`} >
                        <img className="mt-4 mb-4" style={{margin:'auto',width:"80%"}} src={item.img}/>
                        <h1>{item.names}</h1>
                    </div>
                ))}
                
                <SetTime 
                routineId={routineId} 
                currentDetailId={currentDetailId}
                isCurrentTimeRunning={isCurrentTimeRunning}
                setSubDetailTime={setSubDetailTime}
                subDetailTime={subDetailTime}
                setDetailTime={setDetailTime}
                setIsCurrentRunning={setIsCurrentRunning}
                startRrcodResultData={startRrcodResultData}
                currentRrcodingRoutineId={currentRrcodingRoutineId}
                startLocalTimer={startLocalTimer}
                resetLocalTimer={resetLocalTimer}
                stopLocalTimer={stopLocalTimer}
                />
                {
                addSetState.map((item,index)=>(
                currentRrcodingRoutineId===routineId||startRrcodResultData===false?
                <div key={index} className={"container mt-0 p-0 d-grid gap-2"}>
                    <form className={"d-flex"}>
                        <label className={`btn`} style={{backgroundColor:'#FFD600'}}>{item.id}</label>
                        <input 
                            id={item.id}
                            data-id={"weight"}
                            ref={refWeight}
                            className={"form-control me-sm-2"} 
                            type="number" 
                            onWheel={e=>{e.target.blur()}}
                            onBlur={e => fixKgAndManyNum(e)}
                            placeholder={item.weight} 
                        />
                        <input 
                            id={item.id}
                            data-id={"many"}
                            ref={refMany}
                            className={"form-control me-sm-2"} 
                            type="number" 
                            onWheel={e=>{e.target.blur()}}
                            onBlur={e => fixKgAndManyNum(e)} 
                            placeholder={item.many} 
                        />
                        <button type="button" className={`btn`} style={{border:"revert"}} id={item.id} data-class={item.id} data-id={"complete"} onClick={e=>checkExResult(e)} >○</button>
                    </form>
                </div>
                :
                <div key={index} className={"container mt-0 p-0 d-grid gap-2"}>
                    <form className={"d-flex"}>
                        <label className="btn btn-primary disabled">{item.id}</label>
                        <input 
                            className={"form-control me-sm-2"} 
                            type="number" 
                            placeholder={item.weight} 
                            readOnly 
                        />
                        <input 
                            className={"form-control me-sm-2"} 
                            type="number" 
                            placeholder={item.many} 
                            readOnly 
                        />
                    </form>
                </div>
                ))
                }
                {
                currentRrcodingRoutineId===routineId||startRrcodResultData===false?
                <div className={`container ${styles.runningFlexButton}`}>
                    <p className={styles.runningFontButton} style={{marginRight: "20%",color:"blue"}} type="button" id='add' onClick={e=>addAndRemoveExSet(e)}>+ 추가</p>
                    <p className={styles.runningFontButton} style={{color:"red"}} type="button" id='remove' onClick={e=>addAndRemoveExSet(e)}>- 삭제</p>
                </div>
                :
                <div></div>
                }
        </div>
            <div className={`${styles.dummyContainers} p-5 mt-4`}></div>
            {currentRrcodingRoutineId===routineId||startRrcodResultData===false?
            <footer className={styles.flexButton}>        
                <div></div>
                <Button className={`${styles.prettyButton}  me-5`} disabled={isDisabledLeft} type="button" id="prev" onClick={e=>nextAndPrevExButton(e)}>이전</Button>
                <Button className={styles.prettyButton} disabled={isDisabledRight} type="button" id="next" onClick={e=>nextAndPrevExButton(e)}>다음</Button>
            </footer>
            :
            <footer></footer>
            }
            </div>
    </>
}