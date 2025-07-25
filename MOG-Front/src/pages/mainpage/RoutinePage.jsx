import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../assets/bootstrap/css/mainpage.module.css";
import "../../assets/bootstrap/css/bootstrap.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { URL } from "../../config/constants";
import { Button, Card, ListGroup, Modal } from "react-bootstrap";

export default function RoutinePage({
        useDataRoutine,
        fetchData,
        detailData,
        startRrcodResultData,
        setIsOpen,
        setMakeRoutine,
        initMakeRoutine,
        setCheckPageWhenRunningPage,
        setRoutineId,
        currentRrcodingRoutineId
    }){
    const navigate = useNavigate();
    const makeRoutineBoxRef = useRef();
    const {search } = useLocation();
    const params = search.slice(-1);
    const [initDetailDEx,setDetailEx] = useState();
    const [settingModel,setSettingModel] = useState(false);
    const [isShowDelete,setIsShowDelete] = useState(true);
    const [getSelectRoutine,setGetSelectRoutine] = useState();
    const [infoModel,setInfoModel] = useState(false);

    const routineDetailButton=(e)=>{
        e.stopPropagation();
        const checkId = e.target.children[1]===undefined?e.target.id:e.target.children[1].id;
        setCheckPageWhenRunningPage(true);
        navigate(`/data/runningroutine?routineId=${params}&DetailId=${checkId}`,{state:initMakeRoutine});
    }
    const startRoutine=()=>{
        if(!startRrcodResultData){
            setCheckPageWhenRunningPage(false);
            setIsOpen(true);
        }
    }
    const loadRoutineDetail=async ()=>{
            await axios.get(URL.ROUNTINE)
            .then(res=> setMakeRoutine(res.data[params-1].state))
            await axios.get(URL.ROUTINEDETAIL)
            .then(res=> setDetailEx(res.data[params-1].state))
    }

    const routineSetting= async(e)=>{
        e.stopPropagation();
        if(e.target.id==="delete"){
            const deleteSaveData = initMakeRoutine.filter(item=>(item.set_id!==getSelectRoutine));
            const deleteDetailData = initDetailDEx.filter(item=>(item.id!==getSelectRoutine))
            await axios.put(`${URL.ROUNTINE}/${params}/`,{id:String(useDataRoutine[params-1].id),name:useDataRoutine[params-1].name,state:[...deleteSaveData]})
            await axios.put(`${URL.ROUTINEDETAIL}/${params}`,{id:String(useDataRoutine[params-1].id),state:[...deleteDetailData]})
            setMakeRoutine(deleteSaveData);
            setDetailEx(deleteDetailData);
        }
        else {
            setSettingModel(true)
            setGetSelectRoutine(e.target.id)
        }
        
    }
    const switchExButton=async()=>{
        setSettingModel(false);
    }

    useEffect(()=>{
        loadRoutineDetail();
        setRoutineId(params);
        fetchData();
        detailData();
    },[])
    return<>
        <div className={"container mt-5 p-3"}></div>
        <button className={`btn btn-lg btn-danger`} type="button" onClick={()=>navigate('/data/')}>뒤로가기</button>
        <div className={`${styles.mainpage} container mt-0 p-0`}>
                <div ref={makeRoutineBoxRef} className={"container mt-0 p-0"}>
                    {
                    initMakeRoutine.map((item,index)=>
                    <button key={index} className="btn btn-lg btn-dark"  id={item.names}
                            style={{width:'100%', fontSize:'25px', textAlign:'left',display:'flex'}}  
                            type="button" onClick={e=>routineDetailButton(e)}>
                            <img alt={item.imgfile} style={{width:'100px'}} src={item.imgfile}/>
                            {item.names}
                            <a style={{marginLeft:'auto'}} href="#" id={item.set_id} onClick={e=>routineSetting(e)}>...</a>
                       </button>
                    )
                    }             
                </div>
            <div className={`${styles.dummyContainers} p-5 mt-4`}></div>
            {startRrcodResultData===false||currentRrcodingRoutineId===params?
            <footer className={`${styles.flexButton}`}>
                <button className={`${styles.buttonSize} btn btn-lg ${startRrcodResultData?"btn-success":"btn-primary"} `} type="button" id="1" onClick={e=>startRrcodResultData?setIsOpen(true):startRoutine()}>{startRrcodResultData?"운동 완료":"운동 시작"}</button>
                <button className={`${styles.buttonSize} btn btn-lg btn-primary`} type="button" onClick={()=>navigate("/data/select",{state:params})}>운동 추가</button>
            </footer>
            :
            <footer></footer>
            }
        </div>
        <Modal show={settingModel} onHide={() => setSettingModel(false)}>
        <Modal.Header>
            설정
        </Modal.Header>
        <Modal.Body>
            <Card>
                <ListGroup>
                    <ListGroup.Item action onClick={()=>setInfoModel(true)}>
                        운동 정보
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={()=>switchExButton()}>
                        순서 변경
                    </ListGroup.Item>
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
    <Modal show={infoModel} onHide={() => setInfoModel(false)}>
        <Modal.Header>
            운동 정보
        </Modal.Header>
        <Modal.Body>
            {JSON.stringify(initMakeRoutine[getSelectRoutine])}
        </Modal.Body>
    </Modal>
    </>
}