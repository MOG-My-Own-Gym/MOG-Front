import { useNavigate } from "react-router-dom";
import styles from "../../assets/bootstrap/css/mainpage.module.css";
import "../../assets/bootstrap/css/bootstrap.css";
import { useEffect, useRef, useState } from "react";

export default function CategoryPage(){
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
    let makeDetailList;

    const [initcategory,setCategory] = useState([]);
    const [initequipment,setEquipment] = useState([]);
    const [initforce,setForce] = useState([]);
    const [initlevel,setLevel] = useState([]);
    const [initmechanic,setMechanic] = useState([]);
    const [initprimaryMuscles,setPrimaryMuscles] = useState([]);
    const [initsecondaryMuscles,setSecondaryMuscles] = useState([]);
    const [initmakeDetail,setMakeDetail] = useState([]);
    const [initDeduplicationDetail,setDeduplicationDetail] = useState([]);

    const navigate = useNavigate();
    const makeRoutineContainer = useRef(null);
    const makeRoutineList = useRef(null);

    function search(){
        makeDetailList = document.querySelector('input').value;
        makedetil(makeDetailList,'name')
    }

    function makedetil(category,nameStr){
            makeRoutineContainer.innerHTML='';
            makeDetailList = category;
            console.log('category:',category);
            console.log('nameStr:',nameStr);
            console.log('initmakeDetail',initmakeDetail);
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
            console.log('filterMakeListNode:',filterMakeListNode)
            
            setDeduplicationDetail(filterMakeListNode);
       
    }
    console.log('initDeduplicationDetail:',initDeduplicationDetail);
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
                        id: i+1,
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
    },[])
    
    return<>
        <div className={"container mt-5 p-3"}></div>
            <button className={`btn btn-lg btn-primary`} type="button" onClick={()=>navigate(-1)}>뒤로가기</button>
            <form className={"d-flex"}>
                <input className={"form-control me-sm-2"} type="search" placeholder="Search"/>
                <button className={"btn btn-secondary my-2 my-sm-0"} type="submit">Search</button>
            </form>
            <div  className={`${styles.mainpage} container mt-0 p-0`}>
            <div ref={makeRoutineList} style={{overflowX: 'scroll', whiteSpace: 'nowrap'}} className={"container"}>
                    <div  className="container">
                    운동 종류
                     {initcategory.map((item,index) => (
                        <span key={index}>
                            <a  href="#" onClick={(e) => {makedetil(e.currentTarget.textContent,'category')}}>{item}</a>
                        </span>
                    ))
                    }
                    </div>
                    <div  className="container">
                    사용 기구
                     {initequipment.map((item,index)=>(
                        <span key={index}>
                            <a  href="#" onClick={(e) => {makedetil(e.currentTarget.textContent,'equipment')}}>{item}</a>
                        </span>
                    ))}
                    </div>
                    <div  className="container">
                    풀-푸쉬-스태틱
                     {initforce.map((item,index)=>(
                        <span key={index}>
                            <a  href="#" onClick={(e) => {makedetil(e.currentTarget.textContent,'force')}}>{item}</a>
                        </span>
                    ))}
                    </div>
                    <div  className="container">
                    난이도
                     {initlevel.map((item,index)=>(
                        <span key={index}>
                            <a  href="#" onClick={(e) => {makedetil(e.currentTarget.textContent,'level')}}>{item}</a>
                        </span>
                    ))}
                    </div>
                    <div  className="container">
                    고립, 복합
                     {initmechanic.map((item,index)=>(
                        <span key={index}>
                            <a  href="#" onClick={(e) => {makedetil(e.currentTarget.textContent,'mechanic')}}>{item}</a>
                        </span>
                    ))}
                    </div>
                    <div  className="container">
                    주 근육
                     {initprimaryMuscles.map((item,index)=>(
                        <span key={index}>
                            <a  href="#" onClick={(e) => {makedetil(e.currentTarget.textContent,'primaryMuscles')}}>{item}</a>
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
                {initDeduplicationDetail.map(e=>(
                    <div className="container" key={e.id}>
                        <button className="btn btn-lg btn-primary" style={{width:'100%', fontSize:'25px', textAlign:'left'}}  type="button">
                            <img alt={e.imgfile} style={{width:'100px'}} src={e.imgfile}/>
                            {e.names}
                       </button>
                    </div>
                ))}
            </div>
            <div className={`${styles.dummyContainers} p-5 mt-4`}></div>
            <footer className={`${styles.flexButton}`}>
                <button className={`${styles.buttonSize} btn btn-lg btn-primary`} type="button" onClick={()=>navigate("/routine")}>운동 추가</button>
                <button className={`${styles.buttonSize} btn btn-lg btn-primary`} type="button">되돌리기</button>
            </footer>
        </div>

    </>
}