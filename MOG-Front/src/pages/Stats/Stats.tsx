import { Container, Card } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

import BarChart from '../../components/Stats/BarChart/BarChart';

export default function Stats() {
  return (
    <div
      className="content-body d-flex flex-column align-items-center"
      style={{ height: '100vh', marginTop: '5em', padding: '15em' }}
    >
      <Container className="fluid p-5 ">
        <Container className="d-flex justify-content-end">
          <Container className="d-flex flex-column">
            <h2>이번 주 칼로리 소모량</h2>
            <h4>저번주보다 0 kcal 더 소모했어요</h4>
          </Container>
        </Container>

        <Card>
          <BarChart />
        </Card>
      </Container>
    </div>
  );
}
