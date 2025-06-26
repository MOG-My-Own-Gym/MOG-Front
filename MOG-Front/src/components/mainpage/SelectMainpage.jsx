import { Link, useNavigate } from "react-router-dom";
import styles from "../../assets/bootstrap/css/mainpage.module.css";
import "../../assets/bootstrap/css/bootstrap.css";
import { useEffect } from "react";

export default function SelectMainpage(){
    const navigate = useNavigate();
   
    return<>
    <div className={"container mt-5 p-3"}></div>
    <div className={`${styles.mainpage} container mt-0 p-0`}>
        <div className={"container mt-0 p-0"}>
            <button className={`${styles.containers} btn btn-lg btn-primary`} type="button" onClick={()=>navigate("/routine")}>
                루틴 페이지1
            </button>
             <button className={`${styles.containers} btn btn-lg btn-primary`} type="button" onClick={()=>navigate("/routine")}>
                루틴 페이지2
            </button>
             <button className={`${styles.containers} btn btn-lg btn-primary`} type="button" onClick={()=>navigate("/routine")}>
                루틴 페이지3
            </button>
             <button className={`${styles.containers} btn btn-lg btn-primary`} type="button" onClick={()=>navigate("/routine")}>
                루틴 페이지4
            </button>
             <button className={`${styles.containers} btn btn-lg btn-primary`} type="button" onClick={()=>navigate("/routine")}>
                루틴 페이지5
            </button>
        </div>
        <div className={`${styles.dummyContainers} p-5 mt-4`}></div>
        <footer className={`${styles.flexButton}`}>
            <button className={`${styles.buttonSize} btn btn-lg btn-primary`} type="button" onClick={()=>navigate("/select")}>루틴 생성</button>
            <button className={`${styles.buttonSize} btn btn-lg btn-primary`} type="button">루틴 삭제</button>
        </footer>
    </div>
    </>
}