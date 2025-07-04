import { Container } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

import BarChart from '@/components/Stats/BarChart/BarChart';
import LineChart from '@/components/Stats/LineChart/LineChart';

import styles from './Stats.module.css';

export default function Stats() {
  return (
    <div className={styles.stats}>
      <Container className={styles['stats-container']}>
        <Container className={styles['chart-container']}>
          <div className={styles['shadow-overlay']}>
            <Container className={styles['stats-chart']}>
              <Container className={styles['chart-title']}>
                <Container className={styles['title-container']}>
                  <h2>이번 주 칼로리 소모량</h2>
                  <h5>저번주보다 0 kcal 더 소모했어요</h5>
                </Container>
              </Container>
              <BarChart />
            </Container>
            <Container className={styles['stats-chart']}>
              <Container className={styles['chart-title']}>
                <Container className={styles['title-container']}>
                  <h2>이번 주 칼로리 소모량</h2>
                  <h4>저번주보다 0 kcal 더 소모했어요</h4>
                </Container>
              </Container>
              <LineChart />
            </Container>
          </div>
        </Container>
      </Container>
    </div>
  );
}
