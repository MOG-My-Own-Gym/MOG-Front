import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../../assets/bootstrap/css/mainpage.module.css";
import "../../assets/bootstrap/css/bootstrap.css";
import { Badge, Card, Col, Container, ProgressBar, Row } from "react-bootstrap";

export default function RoutineResultPage(){
    const navigate = useNavigate();
    const {state} = useLocation();
    console.log(state);
    return<>
        
        <Container className="mt-5">
      <Row className="mb-4">
        <Col>
          <h2>
            🏋️‍♂️ 오늘의 운동 결과 <Badge bg="success">완료</Badge>
          </h2>
          <p className="text-muted">2025년 7월 24일 | 오후 6:00</p>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Card bg="light" className="mb-4">
            <Card.Body>
              <Card.Title>🔥 칼로리 소모</Card.Title>
              <Card.Text className="fs-4">430 kcal</Card.Text>
              <ProgressBar now={86} label="86%" />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card bg="light" className="mb-4">
            <Card.Body>
              <Card.Title>🏃‍♀️ 운동 시간</Card.Title>
              <Card.Text className="fs-4">45분</Card.Text>
              <ProgressBar variant="info" now={75} label="75%" />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card bg="light" className="mb-4">
            <Card.Body>
              <Card.Title>📏 이동 거리</Card.Title>
              <Card.Text className="fs-4">6.5 km</Card.Text>
              <ProgressBar variant="warning" now={65} label="65%" />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
            <footer className={`${styles.flexButton}`}>
                <button className={`${styles.buttonSize} btn btn-lg btn-primary`} type="button" onClick={()=>navigate("/data/")}>홈으로</button>
                <button className={`${styles.buttonSize} btn btn-lg btn-primary`} type="button">공유하기</button>
            </footer>
        

    </>
}