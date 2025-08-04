import { useNavigate } from "react-router-dom";
import styles from "../../assets/bootstrap/css/mainpage.module.css";
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
    const [isShowRename,setSIsShowRename] = useState(false);
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
    <div className={styles.mainContainer}>
        <div className={`${styles.secondContainer} pt-4`}>
            {
            checkRoutineUser!==undefined
            ?
            checkRoutineUser.length>0
            ?
            checkRoutineUser.map((item,index)=>(
                <Button key={index} className={`${styles.prettyButton} mb-3`}
                    style={{
                        height:'150px',
                        width:'95%',
                        display:'flex',
                        fontSize:'30px',
                        margin: '10px',
                        backgroundColor:`${currentRrcodingRoutineId===item.id?'#1eff00ff':'#FFD600'}`
                    }}
                    type="button" 
                    onClick={()=>navigate(`/data/routine?routineId=${useDataRoutine[index].id}`)}>
                    🏃🏽‍♂️ {item.name}
                    <a className={styles.detailButton} href="#" id={item.id} onClick={e=>routineSetting(e)}>+</a>
                </Button>
            ))
            :
            <div>
                <h1 className={styles.prettyText}>루틴이 없습니다.
                    <br/>자신만의 루틴을 만들어 보세요!</h1>
            </div>
            :
            <h1>로딩 중</h1>    
            }
        </div>
        {startRrcodResultData===false?
        <footer className={`${styles.flexButton}`}>
            <Button className={styles.prettyButton} type="button" onClick={e=>navigate("/data/select",{state:true})} >루틴 생성</Button>
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
        <Modal className={styles.ModelContainer} show={settingModel} onHide={() => {setSettingModel(false);setIsShowDelete(true);}}>
            <Modal.Header>
                설정
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                    <ListGroup.Item action onClick={()=>{setSIsShowRename(true);setIsShowDelete(true);}}>
                        이름 수정
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={()=>setIsShowDelete(false)}>
                        삭제
                    </ListGroup.Item>
                    <ListGroup.Item hidden={isShowDelete}>
                            <p>정말 삭제 하시겠습니까?</p>
                            <Button id="delete" onClick={e=>{routineSetting(e);setSettingModel(false)}}>확인</Button>
                            <Button onClick={()=>setIsShowDelete(true)}>취소</Button>
                    </ListGroup.Item>
                </ListGroup>
            </Modal.Body>
        </Modal>
        <Modal className={styles.ModelContainer} show={isShowRename} onHide={() => setSIsShowRename(false)}>
            <Modal.Header>수정할 이름 입력</Modal.Header>
            <Modal.Body>
                <input 
                    style={{width:'100%'}} 
                    type="text" 
                    ref={inputRef}
                />
                <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '10px',
                    }}>
                    <Button id="reName" onClick={e=>{routineSetting(e);setSIsShowRename(false)}}>확인</Button>
                    <Button onClick={()=>setSIsShowRename(false)}>취소</Button>
                </div>
            </Modal.Body>
        </Modal>
    </div>
    </>
}