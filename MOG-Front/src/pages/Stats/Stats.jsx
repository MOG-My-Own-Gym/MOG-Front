import { Container } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

import BarChart from '@/components/Stats/BarChart/BarChart';
import LineChart from '@/components/Stats/LineChart/LineChart';

import axios from 'axios';

import styles from './Stats.module.css';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Login/AuthContext';

export default function Stats() {
  const { user } = useContext(AuthContext);
  const [barData, setBarData] = useState(null);
  const [lineData, setLineData] = useState(null);

  const dataToChart = (type, data) => {
    switch (type) {
      case 'kcal':
        return data.map(routine => {
          console.log(routine);
          return { date: routine.tEnd, kcal: routine.routineResult.kcal };
        });

      case 'growth':
        return data.map(routine => {
          console.log(routine);
          return {
            date: routine.tEnd,
            muscle: routine.routineResult.muscle,
            setTotal: routine.routineResult.reSet * routine.routineResult.setNum,
            volumeTotal: routine.routineResult.exVolum,
            rouTime: routine.routineResult.rouTime,
          };
        });
    }
  };
  const fetchWeeklyData = async () => {
    const data = await axios
      .get('http://localhost:8080/api/v1/routine/result', {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then(res => {
        return res.data;
      });
    console.log(data);
    console.log(dataToChart(data));

    return data;
  };
  useEffect(() => {
    const setInitData = async () => {
      const initData = await fetchWeeklyData();
      console.log(initData);
      const kcalData = dataToChart('kcal', initData);
      const growthData = dataToChart('growth', initData);
      setBarData(kcalData);
      setLineData(growthData);
    };

    setInitData();
  }, []);

  useEffect(() => {
    console.log(barData);
  }, [barData]);

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
              <BarChart barData={barData} />
            </Container>
            <Container className={styles['stats-chart']}>
              <Container className={styles['chart-title']}>
                <Container className={styles['title-container']}>
                  <h2>이번 주 칼로리 소모량</h2>
                  <h4>저번주보다 0 kcal 더 소모했어요</h4>
                </Container>
              </Container>
              <LineChart lineData={lineData} />
            </Container>
          </div>
        </Container>
      </Container>
    </div>
  );
}
