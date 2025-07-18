import { Badge, Card, Container, Dropdown, DropdownButton, DropdownItem } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

import BarChart from '@/components/Stats/BarChart/BarChart';
import LineChart from '@/components/Stats/LineChart/LineChart';

import axios from 'axios';

import styles from './Stats.module.css';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Login/AuthContext';
import DoughnutChart from '../../components/Stats/DoughnutChart/DoughnutChart';

export default function Stats() {
  const { user } = useContext(AuthContext);
  const [originData, setOriginData] = useState(null);
  const [barData, setBarData] = useState(null);
  const [lineData, setLineData] = useState(null);
  const [doughnutData, setDoughnutData] = useState(null);
  const [selectMenu, setSelectMenu] = useState('muscle');
  const [lineState, setLineState] = useState('muscle');
  const [dropdownHover, setDropdownHover] = useState(null);

  const [mobile, setMobile] = useState(false);
  const checkMobile = () => {
    setMobile(window.innerWidth <= 400);
  };

  useEffect(() => {
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const keyMap = {
    muscle: '근육 사용량',
    setTotal: '총 세트수',
    volumeTotal: '볼륨 총합',
    rouTime: '총 운동시간',
  };
  const redKeyMap = {
    muscle: '근육 사용량',
    kcal: '칼로리 소모량',
    reSet: '총 세트 수',
    setNum: '세트별 횟수',
    volum: '운동 볼륨',
    rouTime: '총 운동 시간',
    exVolum: '특정 종목 수행수',
  };

  const dataToChart = (type, data) => {
    switch (type) {
      case 'kcal':
        return data.map(routine => {
          return { date: routine.tEnd, kcal: routine.routineResult.kcal };
        });

      case 'growth':
        return data.map(routine => {
          console.log(routine.routineResult);
          console.log(routine.routineResult.setNumber);
          return {
            date: routine.tEnd,
            muscle: routine.routineResult.muscle,
            setTotal: routine.routineResult.reSet * routine.routineResult.setNum,
            volumeTotal: routine.routineResult.exVolum,
            rouTime: routine.routineResult.rouTime,
          };
        });
      case 'activity':
        const activitySet = {};
        data.forEach(routine => {
          routine.routineEndDetails.forEach(red => {
            if (red.srName !== '운동이름') {
              if (activitySet[red.srName]) {
                activitySet[red.srName] += red.reps * red.setNumber;
              } else {
                activitySet[red.srName] = red.reps * red.setNumber;
              }
            }
          });
        });
        console.log(activitySet);
        return activitySet;
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

    return data;
  };
  useEffect(() => {
    const setInitData = async () => {
      const initData = await fetchWeeklyData();
      const kcalData = dataToChart('kcal', initData);
      const growthData = dataToChart('growth', initData);
      const activityData = dataToChart('activity', initData);
      setOriginData(initData);
      setBarData(kcalData);
      setLineData(growthData);
      setDoughnutData(activityData);
    };

    setInitData();
  }, []);

  useEffect(() => {}, [mobile]);

  return (
    <div className={styles.stats}>
      {!mobile ? (
        <Container className={styles['stats-container']}>
          <Container className={styles['chart-container']}>
            <div className={styles['shadow-overlay']}>
              <Container className={styles['stats-chart']}>
                <Container className={styles['chart-title']}>
                  <Container className={styles['title-container']}>
                    <h2>
                      이번 주 <span>칼로리</span> 소모량
                    </h2>
                    <h5>저번주보다 0 kcal 더 소모했어요</h5>
                  </Container>
                </Container>
                <BarChart barData={barData} />
              </Container>
              <Container className={styles['stats-chart']}>
                <Container className={styles['chart-title']}>
                  <Container className={styles['title-container']}>
                    <div className={styles['title-dropdown']}>
                      <div className={styles['title']}>
                        <h2>
                          이번 주 <span></span> 성장 추이
                        </h2>
                        <h5>저번주보다 0 kcal 더 성장했어요</h5>
                      </div>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="primary"
                          id="dropdown-basic"
                          style={{
                            minWidth: '100px',
                            backgroundColor: '#ffc800',
                            border: 'none',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
                          }}
                        >
                          {keyMap[selectMenu] || '선택'}
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{ width: '100%', minWidth: 'unset' }}>
                          {lineData &&
                            Object.keys(lineData[0])
                              .filter(key => {
                                return key !== 'date';
                              })
                              .map((data, i) => (
                                <Dropdown.Item
                                  key={i}
                                  onMouseEnter={() => setDropdownHover(i)}
                                  onMouseLeave={() => setDropdownHover(null)}
                                  onClick={() => {
                                    setSelectMenu(data);
                                    setLineState(data);
                                  }}
                                  style={{
                                    backgroundColor: dropdownHover === i ? '#ffec46ff' : 'white',
                                    color: dropdownHover === i ? 'black' : 'gray',
                                    fontWeight: dropdownHover === i ? 'bold' : '',
                                    transition: 'all 0.2s',
                                  }}
                                >
                                  {keyMap[data]}
                                </Dropdown.Item>
                              ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </Container>
                </Container>
                <LineChart lineData={lineData} lineState={lineState} />
              </Container>
            </div>
            <div className={styles['shadow-overlay']}>
              <Container className={styles['stats-chart-side']}>
                <Container className={styles['chart-title']}>
                  <Container className={styles['title-container']}>
                    <h2>이번 주 운동 트렌드</h2>
                    <h5>{`이번 주는 ${'...'}등을 가장 많이 했어요`}</h5>
                  </Container>
                </Container>
                <DoughnutChart doughnutData={doughnutData} isPolar={true} />
                <Container className={styles['chart-title']}>
                  <Container className={styles['title-container']}>
                    <h2>이번 주 운동 퍼포먼스</h2>
                    <h5>저번주보다 0 kcal 더 소모했어요</h5>
                  </Container>
                </Container>
                <DoughnutChart doughnutData={doughnutData} isPolar={false} />
              </Container>
              <Container className={styles['stats-chart']}>
                <Container className={styles['chart-title']}>
                  <Container className={styles['title-container']}>
                    <h2>
                      이번 주 <span>운동 퍼포먼스</span> 로그
                    </h2>
                    <h5>이번 주 운동의 더 상세한 데이터를 볼 수 있어요</h5>
                  </Container>
                </Container>
                <Container className={styles['stats-logs']}>
                  <Container>
                    {originData?.map((data, i) => {
                      console.log(data, i);
                      return (
                        <Card style={{ width: '100%' }}>
                          <Card.Header>{`루틴 ${data.tStart.substring(0, 10)} ${data.tstart.substring(11, 16)} ~ ${data.tEnd.substring(11, 16)}`}</Card.Header>
                          <Card.Body>
                            <Card.Body>
                              <div className={styles['red-details']}>
                                {Object.entries(data.routineResult).map(entry => {
                                  if (entry[0] == 'rrId') return;
                                  console.log(entry);
                                  return (
                                    <div className={styles['red-detail']}>
                                      <div className={styles['red-key']}>{redKeyMap[entry[0]]}</div>
                                      <div className={styles['red-value']}>{entry[1]}</div>
                                    </div>
                                  );
                                })}
                              </div>
                              {data.routineEndDetails.map(red => {
                                return (
                                  <Badge bg="undefined" className={styles['red-badge']}>
                                    {red.srName}
                                  </Badge>
                                );
                              })}
                            </Card.Body>
                          </Card.Body>
                        </Card>
                      );
                    })}
                  </Container>
                </Container>
              </Container>
            </div>
          </Container>
        </Container>
      ) : (
        <>
          <Container className={styles['chart-title']}>
            <Container className={styles['title-container']}>
              <h2>
                이번 주 <span>칼로리</span> 소모량
              </h2>
              <h5>저번주보다 0 kcal 더 소모했어요</h5>
            </Container>
          </Container>
          <BarChart barData={barData} isMobile={mobile} />

          <Container className={styles['chart-title']}>
            <Container className={styles['title-container']}>
              <h2>
                이번 주 <span></span> 성장 추이
              </h2>
              <h5>저번주보다 0 kcal 더 소모했어요</h5>
            </Container>
            <Dropdown>
              <Dropdown.Toggle
                variant="primary"
                id="dropdown-basic"
                style={{
                  width: '70px',
                  fontSize: '9px',
                  padding: '2px',
                  backgroundColor: '#ffc800',
                  border: 'none',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
                }}
              >
                {keyMap[selectMenu] || '선택'}
              </Dropdown.Toggle>

              <Dropdown.Menu style={{ width: '100%', minWidth: 'unset', fontSize: '9px' }}>
                {lineData &&
                  Object.keys(lineData[0])
                    .filter(key => {
                      return key !== 'date';
                    })
                    .map((data, i) => (
                      <Dropdown.Item
                        key={i}
                        onMouseEnter={() => setDropdownHover(i)}
                        onMouseLeave={() => setDropdownHover(null)}
                        onClick={() => {
                          setSelectMenu(data);
                          setLineState(data);
                        }}
                        style={{
                          backgroundColor: dropdownHover === i ? '#ffec46ff' : 'white',
                          color: dropdownHover === i ? 'black' : 'gray',
                          fontWeight: dropdownHover === i ? 'bold' : '',
                          transition: 'all 0.2s',
                          fontSize: '9px',
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        {keyMap[data]}
                      </Dropdown.Item>
                    ))}
              </Dropdown.Menu>
            </Dropdown>
          </Container>
          <LineChart lineData={lineData} lineState={lineState} />
          <Container className={styles['chart-title']}>
            <Container className={styles['title-container']}>
              <h2>이번 주 운동 트렌드</h2>
              <h5>{`이번 주는 ${'...'}등을 가장 많이 했어요`}</h5>
            </Container>
          </Container>
          <DoughnutChart doughnutData={doughnutData} isPolar={true} isMobile={mobile} />
          <Container className={styles['chart-title']}>
            <Container className={styles['title-container']}>
              <h2>이번 주 운동 퍼포먼스</h2>
              <h5>저번주보다 0 kcal 더 소모했어요</h5>
            </Container>
          </Container>
          <DoughnutChart doughnutData={doughnutData} isPolar={false} isMobile={mobile} />

          <Container className={styles['chart-title']}>
            <Container className={styles['title-container']}>
              <h2>
                이번 주 <span>운동 퍼포먼스</span> 로그
              </h2>
              <h5>이번 주 운동의 더 상세한 데이터를 볼 수 있어요</h5>
            </Container>
          </Container>
          <Card>
            <Container className={styles['stats-logs']}>
              <Container>
                {originData?.map((data, i) => {
                  console.log(data, i);
                  return (
                    <Card style={{ width: '100%' }}>
                      <Card.Header>{`루틴 ${data.tStart.substring(0, 10)} ${data.tstart.substring(11, 16)} ~ ${data.tEnd.substring(11, 16)}`}</Card.Header>
                      <Card.Body>
                        {data.routineEndDetails.map(red => {
                          return (
                            <Badge bg="undefined" className={styles['red-badge']}>
                              {red.srName}
                            </Badge>
                          );
                        })}
                      </Card.Body>
                    </Card>
                  );
                })}
              </Container>
            </Container>
          </Card>
        </>
      )}
    </div>
  );
}
