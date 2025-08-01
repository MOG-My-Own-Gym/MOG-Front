import styles from "../../assets/bootstrap/css/mainpage.module.css";
function MainRrcodResultTime({
    formatTime,
    pauseTimer,
    startTimer,
    isRunning,
    setIsOpen,
    setResetTimeCheckBoolean
  }) {

    const restTimecheck=()=>{
      setResetTimeCheckBoolean(true);
      setIsOpen(true)
    }
  return <>
      <footer className={styles.allTimeFooter}>
        <div>
          ⏱️{formatTime()}
        </div>
        <div className={styles.allTimeButtonContainer}>
          <p className={styles.allTimeButton} onClick={isRunning?pauseTimer:startTimer}>{isRunning?'⏸':'▶'}</p>
          <p className={styles.allTimeButton} onClick={()=>restTimecheck()}>■</p>
        </div>
    </footer>
  </>
}

export default MainRrcodResultTime;