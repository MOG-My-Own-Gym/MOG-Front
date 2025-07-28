import { useNavigate } from "react-router-dom";
import styles from "../../assets/bootstrap/css/mainpage.module.css";
import "../../assets/bootstrap/css/bootstrap.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { URL } from "../../config/constants";
import MainRrcodResultTime from "./MainRrcodResultTime";
import { Button, Card, ListGroup, Modal } from "react-bootstrap";

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
        setResetTimeCheckBoolean,
        setCheckRoutineUser,
        checkRoutineUser
    }){

    const navigate = useNavigate();
    const inputRef = useRef(null);
    const [settingModel,setSettingModel] = useState(false);
    const [getSelectRoutine,setGetSelectRoutine] = useState();
    const [isShowRename,setSIsShowRename] = useState(true);
    const [isShowDelete,setIsShowDelete] = useState(true);
    const userInfo = JSON.parse(localStorage.getItem('user'));

    const routineSetting= async(e)=>{
        e.stopPropagation();
        if(e.target.id==="reName") {
            await axios.put(`${URL.ROUNTINE}/${getSelectRoutine}`,{
                id:String(useDataRoutine[getSelectRoutine-1].id),
                name:inputRef.current.value,
                userId:String(userInfo.usersId),
                state:[...useDataRoutine[getSelectRoutine-1].state]
            })
            fetchData()
        }
        else if(e.target.id==="delete"){
            await axios.delete(`${URL.ROUNTINE}/${getSelectRoutine}`)
            await axios.delete(`${URL.ROUTINEDETAIL}/${getSelectRoutine}`)
            fetchData();
        }
        else {
            setSettingModel(true)
            setGetSelectRoutine(e.target.id)
        }
        
    }
    
    useEffect(()=>{ 
        fetchData();
    },[])
    useEffect(()=>{
        if(useDataRoutine!==undefined){
            setCheckRoutineUser(()=>{
                const checkUser = useDataRoutine.filter(item=>item.userId===String(userInfo.usersId))
                return checkUser
            })
        }
    },[useDataRoutine])

    
    return<>
    <div className={"container mt-5 p-3"}></div>
    <div className={`${styles.mainpage} container mt-0 p-0`}>
        <div className={"container mt-0 p-0"}>
            {
            checkRoutineUser!==undefined
            ?
            checkRoutineUser.map((item,index)=>(
             <Button key={index} className={`${styles.containers} btn btn-lg ${currentRrcodingRoutineId===item.id?"btn-warning":"btn-primary"}  `} 
             style={{width:'100%', fontSize:'25px', textAlign:'left',display:'flex'}}
             type="button" 
             onClick={()=>navigate(`/data/routine?routineId=${useDataRoutine[index].id}`)}>
               {item.name}
               <a style={{marginLeft:'auto'}} href="#" id={item.id} onClick={e=>routineSetting(e)}>...</a>
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
        <Modal show={settingModel} onHide={() => setSettingModel(false)}>
            <Modal.Header>
                설정
            </Modal.Header>
            <Modal.Body>
                <Card>
                    <ListGroup>
                        <ListGroup.Item action onClick={()=>setSIsShowRename(false)}>
                           이름 수정
                        </ListGroup.Item>
                        <div hidden={isShowRename}>
                            <input type="text" ref={inputRef}/>
                            <Button id="reName" onClick={e=>{routineSetting(e);setSettingModel(false)}}>확인</Button>
                            <Button onClick={()=>setSIsShowRename(true)}>취소</Button>
                        </div>
                        <ListGroup.Item action onClick={()=>setIsShowDelete(false)}>
                            삭제
                        </ListGroup.Item>
                        <div hidden={isShowDelete}>
                                <p>정말 삭제 하시겠습니까?</p>
                                <Button id="delete" onClick={e=>{routineSetting(e);setSettingModel(false)}}>확인</Button>
                                <Button onClick={()=>setIsShowDelete(true)}>취소</Button>
                            </div>
                    </ListGroup>
                </Card>
            </Modal.Body>
        </Modal>
    </div>
    </>
}