import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../assets/bootstrap/css/mainpage.module.css";
import "../../assets/bootstrap/css/bootstrap.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { URL } from "../../config/constants";

export default function CategoryPage({useDataRoutine,fetchData}){
    const makeListNode =[];
    const id = [];
    const nameR = [];
    const category =[];
    const equipment =[];
    const force = [];
    const level = [];
    const mechanic = [];
    const primaryMuscles = [];
    const secondaryMuscles = [];
    let countSaveRoutineInt;
    let makeDetailList;
    let saveR;
    let addSetId;

    const [initcategory,setCategory] = useState([]);
    const [initequipment,setEquipment] = useState([]);
    const [initforce,setForce] = useState([]);
    const [initlevel,setLevel] = useState([]);
    const [initmechanic,setMechanic] = useState([]);
    const [initprimaryMuscles,setPrimaryMuscles] = useState([]);
    const [initsecondaryMuscles,setSecondaryMuscles] = useState([]);
    const [initmakeDetail,setMakeDetail] = useState([]);
    const [initDeduplicationDetail,setDeduplicationDetail] = useState([]);
    const [initSearch, setSearch] = useState('');
    const [initSaveExercise,setSaveExercise] = useState([]);
    const [initSaveExerciseSpan,setSaveExerciseSpan] = useState([]);
    const [isHidden, setIsHidden] = useState(true);
    const [test, settest] = useState([]);
    
    const {state} = useLocation();
    const navigate = useNavigate();
    const makeRoutineContainer = useRef(null);
    console.log('state:',state);

    function makedetil(e,nameStr){
        e.preventDefault();
        makeRoutineContainer.innerHTML='';
        makeDetailList = e.currentTarget.textContent;
        const filterMakeListNode = initmakeDetail.filter(res=>{
            if(nameStr=='names') return res.names.includes(makeDetailList)
            if(nameStr=='category') return res.category.includes(makeDetailList)
            if(nameStr=='equipment' && res.equipment != null) return res.equipment.includes(makeDetailList)
            if(nameStr=='force' && res.force != null) return res.force.includes(makeDetailList)
            if(nameStr=='level' ) return res.level.includes(makeDetailList)
            if(nameStr=='mechanic' && res.mechanic != null) return res.mechanic.includes(makeDetailList)
            if(nameStr=='instructions' && res.instructions != null) return res.instructions.includes(makeDetailList)
            if(nameStr=='primaryMuscles' && res.primaryMuscles != null) return res.primaryMuscles.includes(makeDetailList)
            if(nameStr=='secondaryMuscles' && res.secondaryMuscles != null) return res.secondaryMuscles.includes(makeDetailList)
            }
        )        
        setDeduplicationDetail(filterMakeListNode);      
    }
    const [useCount,setConunt] = useState(1);
    //console.log('useCount:',useDataRoutine.length<=0?1:parseInt(useDataRoutine[useDataRoutine.length-1].id)+1);
    
    const makeRoutineButton= async () => {
        //e.preventDefault();
        //fetchData();
        console.log('useDataRoutine=======:',useDataRoutine);
        if(state===null) {alert('루틴 생성 실패'); return;}
        if(state===true){
            //setConunt(prev=>prev+1);
            //setSaveExercise(res=>res.map((item,index)=>({...item,id:String(1+index)})));
            addSetId = initSaveExercise.map((item,index)=>({...item,set_id: String(index + 1)}));
            const nameR = 'routine'+String(useDataRoutine.length<=0?1:parseInt(useDataRoutine[useDataRoutine.length-1].id)+1);
            const response = await axios.post(URL.ROUNTINE,{id:String(useDataRoutine.length<=0?1:parseInt(useDataRoutine[useDataRoutine.length-1].id)+1),name:nameR,state:[...addSetId]})
            //setDataRoutine(prev=>[...prev,response.data]);
            navigate(`/data/routine?routineId=${useDataRoutine.length+1}`)
        }else{
            const makeRoutineId = useDataRoutine[state-1].state.length===0?0:Math.max(...useDataRoutine[state-1].state.map(item=>parseInt(item.set_id)));
            console.log('useDataRoutine[state-1].state:',useDataRoutine[state-1].state);
            console.log('makeRoutineId:',makeRoutineId);
            //console.log('initSaveExercise2:',initSaveExercise);
            addSetId = initSaveExercise.map((item,index)=>({...item,set_id: String(makeRoutineId + index + 1)}));
            console.log('initSaveExercise3:',addSetId);
            await axios.put(`${URL.ROUNTINE}/${state}`,{id:String(useDataRoutine[state-1].id),name:useDataRoutine[state-1].name,state:[...useDataRoutine[state-1].state, ...addSetId]})
                        .then(res=>console.log('res:%O',res))
                        .catch(err=>console.log(err))
            //setDataRoutine(prev=>[...prev[state-1].state,...initSaveExercise]);
            navigate(`/data/routine?routineId=${state}`)
            //navigate("/data/routine",{state:state})
        }
            
    }

    const saveRoutineButton=(e)=>{
        e.preventDefault();
        saveR = initmakeDetail.filter(item =>
        item.names.includes(e.currentTarget.id));
        setSaveExercise(prev=>[...prev,...saveR]); 
        settest(prev=>[...prev,...saveR]);
        countSaveRoutineInt = initSaveExercise.filter(item=>item.names===e.currentTarget.id).length+1;
        e.target.children[1].textContent=countSaveRoutineInt;
        if(countSaveRoutineInt===0){
           setIsHidden(true);
        } 
        else{
            setIsHidden(false);
        }
        setSaveExerciseSpan(prev=>[...prev,e.target.children[1].id]);
        
    }
    const deleteRoutineButten=(e)=>{
        e.preventDefault();
        const deleteSaveData = initSaveExercise.slice(0,-1);
        setSaveExercise(deleteSaveData);
        const spanNode = document.getElementById(initSaveExerciseSpan[initSaveExerciseSpan.length -1]);
        if(initSaveExercise.length === 0) {
            document.querySelectorAll('span').textContent='';
            setIsHidden(true);
        }
        else {
            const compreToDeleteEx = spanNode.id.slice(0,-4);
            countSaveRoutineInt = initSaveExercise.filter(item=>item.names===compreToDeleteEx).length-1;
            spanNode.textContent=countSaveRoutineInt;
            setIsHidden(false);
        }
        setSaveExerciseSpan(initSaveExerciseSpan.slice(0,-1)!==null?initSaveExerciseSpan.slice(0,-1):[]);
    }
    
    useEffect(()=>{
        const filteredItems = initmakeDetail.filter(item =>
        item.names.toLowerCase().includes(initSearch.toLowerCase()));
        setDeduplicationDetail(filteredItems); 
    },[initSearch])

    useEffect(()=>{
       fetch('https://raw.githubusercontent.com/kimbongkum/ict4e/master/exercises.json')
            .then(res =>res.json())
            .then(exercise => {     
                const arr = Object.values(exercise)[0]
                const makeDetailNode = [];
                const imgfile = [];
                //console.log(...arr)
                for (let i=0;i<arr.length;i++) {

                    const name1 = arr[i].name.replaceAll(" ","_");
                    const name2 = name1.replaceAll("/","_");

                    id.push(arr[i].id)
                    nameR.push(arr[i].name)
                    category.push(arr[i].category);
                    equipment.push(arr[i].equipment);
                    force.push(arr[i].force);
                    level.push(arr[i].level);
                    mechanic.push(arr[i].mechanic);
                    primaryMuscles.push(arr[i].primaryMuscles[0]);
                    secondaryMuscles.push(arr[i].secondaryMuscles[0]);

                    makeDetailNode.push({
                        id: String(i+1),
                        names: arr[i].name,
                        category: arr[i].category,
                        equipment: arr[i].equipment,
                        force: arr[i].force,
                        level:arr[i].level,
                        mechanic: arr[i].mechanic,
                        instructions: arr[i].instructions,
                        primaryMuscles: arr[i].primaryMuscles[0],
                        secondaryMuscles: arr[i].secondaryMuscles[0],
                        imgfile:`https://raw.githubusercontent.com/kimbongkum/ict4e/master/exercises/${name2}/images/0.jpg`
                    })
                }
                //const addListImg ={...makeDetailNode,imgfile:imgfile};
                makeListNode.push({
                    names: nameR,
                    category: [...new Set(category)],
                    equipment: [...new Set(equipment)],
                    force: [...new Set(force)],
                    level:[...new Set(level)],
                    mechanic: [...new Set(mechanic)],
                    //instructions: instructions,
                    primaryMuscles: [...new Set(primaryMuscles)],
                    secondaryMuscles: [...new Set(primaryMuscles)]
                });      
                setDeduplicationDetail(makeDetailNode);
                setMakeDetail(makeDetailNode);
                setCategory(Object.values(makeListNode[0].category))
                setEquipment(Object.values(makeListNode[0].equipment))
                setForce(Object.values(makeListNode[0].force))
                setLevel(Object.values(makeListNode[0].level))
                setMechanic(Object.values(makeListNode[0].mechanic))
                setPrimaryMuscles(Object.values(makeListNode[0].primaryMuscles))
                setSecondaryMuscles(Object.values(makeListNode[0].secondaryMuscles))
            });    
        fetchData();
    },[])
    
    return<>
        <div className={"container mt-5 p-3"}></div>
            <button className={`btn btn-lg btn-primary`} type="button" onClick={()=>navigate('/data/')}>뒤로가기</button>
            <form className={"d-flex"}>
                <input className={"form-control me-sm-2"} type="search" placeholder="운동 이름을 입력하세요." onChange={e => setSearch(e.target.value)}/>
            </form>
            <div  className={`${styles.mainpage} container mt-0 p-0`}>
            <div style={{overflowX: 'scroll', whiteSpace: 'nowrap'}} className={"container"}>
                    <div  className="container">
                    운동 종류
                     {initcategory.map((item,index) => (
                        <span key={index}>
                            <a  href="#" onClick={(e) => {makedetil(e,'category')}}>{item}</a>
                        </span>
                    ))
                    }
                    </div>
                    <div  className="container">
                    사용 기구
                     {initequipment.map((item,index)=>(
                        <span key={index}>
                            <a  href="#" onClick={(e) => {makedetil(e,'equipment')}}>{item}</a>
                        </span>
                    ))}
                    </div>
                    <div  className="container">
                    풀-푸쉬-스태틱
                     {initforce.map((item,index)=>(
                        <span key={index}>
                            <a  href="#" onClick={(e) => {makedetil(e,'force')}}>{item}</a>
                        </span>
                    ))}
                    </div>
                    <div  className="container">
                    난이도
                     {initlevel.map((item,index)=>(
                        <span key={index}>
                            <a  href="#" onClick={(e) => {makedetil(e,'level')}}>{item}</a>
                        </span>
                    ))}
                    </div>
                    <div  className="container">
                    고립, 복합
                     {initmechanic.map((item,index)=>(
                        <span key={index}>
                            <a  href="#" onClick={(e) => {makedetil(e,'mechanic')}}>{item}</a>
                        </span>
                    ))}
                    </div>
                    <div  className="container">
                    주 근육
                     {initprimaryMuscles.map((item,index)=>(
                        <span key={index}>
                            <a  href="#" onClick={(e) => {makedetil(e,'primaryMuscles')}}>{item}</a>
                        </span>
                    ))}
                    </div>
                    <div  className="container">
                    보조 근육
                     {initsecondaryMuscles.map((item,index)=>(
                        <span key={index}>
                            <a  href="#" onClick={(e) => {makedetil(e.currentTarget.textContent,'secondaryMuscles')}}>{item}</a>
                        </span>
                    ))}
                    </div>
                
            </div>
            <div ref={makeRoutineContainer} className={"container mt-0 p-0 d-grid gap-2"}>
                {initDeduplicationDetail.length===0
                ?
                <h1>불러오는 중</h1>
                :
                initDeduplicationDetail.map(item=>(
                    <div className="container" key={item.id}>
                        <button  className="btn btn-lg btn-dark"  id={item.names}
                            style={{width:'100%', fontSize:'25px', textAlign:'left',display:'flex'}}  
                            type="button" onClick={e=>saveRoutineButton(e)}>
                            <img alt={item.imgfile} style={{width:'100px'}} src={item.imgfile}/>
                            {item.names}
                            <span id={item.names+'Span'} style={{marginLeft:'auto'}}></span>
                       </button>
                    </div>
                ))}
            </div>
            <div className={`${styles.dummyContainers} p-5 mt-4`}></div>
            <footer className={`${styles.flexSelectButton}`}>
                <button className={`${styles.buttonSize} btn btn-lg btn-primary`} type="button" onClick={makeRoutineButton} hidden={isHidden}>운동 추가</button>
                <button className={`${styles.buttonSize} btn btn-lg btn-primary`} type="button" onClick={e=>deleteRoutineButten(e)} hidden={isHidden}>되돌리기</button>
            </footer>
        </div>

    </>
}