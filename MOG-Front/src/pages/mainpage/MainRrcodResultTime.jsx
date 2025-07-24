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
      <footer
        style={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          backgroundColor: '#f8f9fa',
          padding: '10px 0',
          textAlign: 'center',
          borderTop: '1px solid #dee2e6',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          zIndex: 100,
        }}
      >
      <div>⏱️ {formatTime()}</div>
      <div style={{ marginTop: '8px' }}>
        {isRunning ? (
          <button onClick={pauseTimer}>⏸ 일시정지</button>
        ) : (
          <button onClick={startTimer}>▶ 재개</button>
        )}
        <button onClick={()=>restTimecheck()} style={{ marginLeft: '10px' }}>🔁 초기화</button>
      </div>

    </footer>
  </>
}

export default MainRrcodResultTime;