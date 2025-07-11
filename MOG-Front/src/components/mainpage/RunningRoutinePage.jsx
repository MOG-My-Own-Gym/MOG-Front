import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../../assets/bootstrap/css/mainpage.module.css";
import "../../assets/bootstrap/css/bootstrap.css";

export default function RunningRoutinePage(){
    const navigate = useNavigate();
    const location = useLocation([]);
    return<>
        <div className={"container mt-5 p-3"}></div>
            <button className={`btn btn-lg btn-primary`} type="button" onClick={()=>navigate(-1)}>뒤로가기</button>
            <div className={`${styles.mainpage} container mt-0 p-0`}>
                <div className={"container mt-0 p-0"}>
                    <h1> 루틴 실행 페이지</h1>
                </div>
            <div className={`${styles.dummyContainers} p-5 mt-4`}></div>
            <footer className={`${styles.flexButton}`}>
                <button className={`${styles.buttonSize} btn btn-lg btn-primary`} type="button" onClick={()=>navigate("/data/routineresult")}>운동 완료</button>
                <button className={`${styles.buttonSize} btn btn-lg btn-primary`} type="button" onClick={()=>navigate("/data/select")}>운동 추가</button>
            </footer>
        </div>

    </>
}