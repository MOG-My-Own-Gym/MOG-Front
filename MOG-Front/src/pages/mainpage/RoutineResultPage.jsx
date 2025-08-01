import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../../assets/bootstrap/css/mainpage.module.css";
import { Badge, Button, Card, Col, Container, ProgressBar, Row } from "react-bootstrap";

export default function RoutineResultPage(){
    const navigate = useNavigate();
    const {state} = useLocation();
    console.log(state);
    const today = new Date(state.tEnd);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short'};
    const formatted = today.toLocaleDateString('ko-KR', options);

    return<>
        
      <Container className={`mt-5 ${styles.resultContainer}`}>
        <Row className={styles.resultTitle}>
          <Col>
            <h2>
              🏋️‍♂️ 오늘의 운동 결과 <Badge bg="success">완료</Badge>
            </h2>
            <p className="text-muted">{formatted}</p>
          </Col>
        </Row>
        <Row className={styles.resultContent}>
            <Col md={4} style={{ display: 'flex',justifyContent: 'center'}}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Text className={styles.fontInfo}>🔥{state.routineResult.kcal}<span className={styles.fontSpanInfo}>Kcal 소모</span></Card.Text>
                  <ProgressBar now={state.routineResult.kcal} />
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} style={{ display: 'flex',justifyContent: 'center'}}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Text className={styles.fontInfo}>⏱️{state.routineResult.rouTime}<span className={styles.fontSpanInfo}>분 운동</span></Card.Text>
                  <ProgressBar variant="info" now={state.routineResult.rouTime} />
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} style={{ display: 'flex',justifyContent: 'center'}}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Text className={styles.fontInfo}>➿{state.routineResult.reSet}<span className={styles.fontSpanInfo}>Set 횟수</span></Card.Text>
                  <ProgressBar variant="warning" now={state.routineResult.reSet} />
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} style={{ display: 'flex',justifyContent: 'center'}}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Text className={styles.fontInfo}>⚖️{state.routineResult.exVolum}<span className={styles.fontSpanInfo}>Kg 사용</span></Card.Text>
                  <ProgressBar variant="secondary" now={state.routineResult.exVolum} />
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} style={{ display: 'flex',justifyContent: 'center'}}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Text className={styles.fontInfo}>📊{state.routineResult.volum}<span className={styles.fontSpanInfo}>운동 볼륨</span></Card.Text>
                  <ProgressBar variant="primary" now={state.routineResult.volum} />
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} style={{ display: 'flex',justifyContent: 'center'}}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Text className={styles.fontInfo}>🔢{state.routineResult.setNum}<span className={styles.fontSpanInfo}>운동 횟수</span></Card.Text>
                  <ProgressBar variant="success" now={state.routineResult.setNum} />
                </Card.Body>
              </Card>
            </Col>
           <div className={`${styles.dummyContainers} p-5 mt-4`}></div>
        </Row>
      </Container>
      <div className={`${styles.dummyContainers} p-5 mt-4`}></div>
            <footer className={styles.flexButton}>
                  <Button className={`${styles.prettyButton} fs-6 btn btn-lg me-5 `} type="button" onClick={()=>navigate("/data/")}>홈으로</Button>
                  <Button className={`${styles.prettyButton} fs-6 btn btn-lg`}  type="button">공유하기</Button>
            </footer>
        

    </>
}