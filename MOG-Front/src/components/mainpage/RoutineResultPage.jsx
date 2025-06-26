import { Link, useNavigate } from "react-router-dom";
import styles from "../../assets/bootstrap/css/mainpage.module.css";
import "../../assets/bootstrap/css/bootstrap.css";

export default function RoutineResultPage(){
    const navigate = useNavigate();
    return<>
        <div className={"container mt-5 p-3"}></div>
        <div className={`${styles.mainpage} container mt-0 p-0`}>
                <div className={"container mt-0 p-0"}>
                    <h1> 루틴 완료 페이지</h1>
                </div>
            <div className={`${styles.dummyContainers} p-5 mt-4`}></div>
            <footer className={`${styles.flexButton}`}>
                <button className={`${styles.buttonSize} btn btn-lg btn-primary`} type="button" onClick={()=>navigate("/home")}>홈으로</button>
                <button className={`${styles.buttonSize} btn btn-lg btn-primary`} type="button">공유하기</button>
            </footer>
        </div>

    </>
}