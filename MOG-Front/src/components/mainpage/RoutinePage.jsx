import { Link, useNavigate } from "react-router-dom";
import styles from "../../assets/bootstrap/css/mainpage.module.css";
import "../../assets/bootstrap/css/bootstrap.css";

export default function RoutinePage(){
    const navigate = useNavigate();
    return<>
        <div className={"container mt-5 p-3"}></div>
        <button className={`btn btn-lg btn-primary`} type="button" onClick={()=>navigate(-1)}>뒤로가기</button>
        <div className={`${styles.mainpage} container mt-0 p-0`}>
                <div className={"container mt-0 p-0"}>
                    <button className={`${styles.containers} btn btn-lg btn-primary`} type="button" onClick={()=>navigate("/runningroutine")}>
                        운동1
                    </button>
                    <button className={`${styles.containers} btn btn-lg btn-primary`} type="button" onClick={()=>navigate("/runningroutine")}>
                        운동2
                    </button>
                    <button className={`${styles.containers} btn btn-lg btn-primary`} type="button" onClick={()=>navigate("/runningroutine")}>
                        운동3
                    </button>
                    <button className={`${styles.containers} btn btn-lg btn-primary`} type="button" onClick={()=>navigate("/runningroutine")}>
                        운동4
                    </button>
                    <button className={`${styles.containers} btn btn-lg btn-primary`} type="button" onClick={()=>navigate("/runningroutine")}>
                        운동5
                    </button>
                       
                </div>
            <div className={`${styles.dummyContainers} p-5 mt-4`}></div>
            <footer className={`${styles.flexButton}`}>
                <button className={`${styles.buttonSize} btn btn-lg btn-primary`} type="button" onClick={(e)=>{navigate("/runningroutine");e.target.value=='운동 완료'?e.target.value='운동 시작':e.target.value='운동 완료';}}>운동 시작</button>
                <button className={`${styles.buttonSize} btn btn-lg btn-primary`} type="button" onClick={()=>navigate("/select")}>운동 추가</button>
            </footer>
        </div>

    </>
}