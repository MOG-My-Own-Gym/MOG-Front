import { Link, useNavigate } from "react-router-dom";
import styles from "../../assets/bootstrap/css/mainpage.module.css";
import "../../assets/bootstrap/css/bootstrap.css";
import { useEffect, useState } from "react";

export default function CategoryPage(){
    const navigate = useNavigate();
    const [routineContainer,setRoutineContainer] = useState(0);
    useEffect(()=>{
        
    },[])
    return<>
        <div className={"container mt-5 p-3"}></div>
        <button className={`btn btn-lg btn-primary`} type="button" onClick={()=>navigate(-1)}>뒤로가기</button>
        <div className={`${styles.mainpage} container mt-0 p-0`}>
                    <form className="d-flex">
                        <input className="form-control me-sm-2" type="search" placeholder="Search"/>
                        <button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
                    </form>
                <div className={"container mt-0 p-0"}>
                    <h1>루틴 생성 페이지</h1>
                </div>
            <div className={`${styles.dummyContainers} p-5 mt-4`}></div>
            <footer className={`${styles.flexButton}`}>
                <button className={`${styles.buttonSize} btn btn-lg btn-primary`} type="button" onClick={()=>navigate("/routine")}>운동 추가</button>
                <button className={`${styles.buttonSize} btn btn-lg btn-primary`} type="button">되돌리기</button>
            </footer>
        </div>

    </>
}