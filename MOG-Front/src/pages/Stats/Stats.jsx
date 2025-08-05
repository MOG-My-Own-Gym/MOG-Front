import { Badge, Card, Container, Dropdown, DropdownButton, DropdownItem } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

import BarChart from '@/components/Stats/BarChart/BarChart';
import LineChart from '@/components/Stats/LineChart/LineChart';

import axios from 'axios';

import styles from './Stats.module.css';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Login/AuthContext';
import DoughnutChart from '../../components/Stats/DoughnutChart/DoughnutChart';
import RadialGradientSpinner from '../../components/Loader/RadialGradientSpinner';
import LoadFail from '../../components/Loader/LoadFail/LoadFail';

export default function Stats() {
  const { user } = useContext(AuthContext);
  const [toggle, setToggle] = useState('week');
  const [lastData, setLastData] = useState(null);
  const [originData, setOriginData] = useState(null);
  const [barData, setBarData] = useState(null);
  const [lineData, setLineData] = useState(null);
  const [doughnutData, setDoughnutData] = useState(null);
  const [selectMenu, setSelectMenu] = useState('muscle');
  const [lineState, setLineState] = useState('muscle');
  const [dropdownHover, setDropdownHover] = useState(null);
  const [kcalCalc, setKcalCalc] = useState(0);
  const [redCalc, setRedCalc] = useState([]);
  const [activityCalc, setActivityCalc] = useState(0);
  const [activityTop, setActivityTop] = useState('');

  const [mobile, setMobile] = useState(false);
  const checkMobile = () => {
    setMobile(window.innerWidth <= 400);
  };

  useEffect(() => {
    checkMobile();
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
  const redCalcMap = {
    muscle: `${redCalc[0]}%`,
    setTotal: `${redCalc[1]}회`,
    volumeTotal: `${redCalc[2]}kg`,
    rouTime: `${(redCalc[3] / 60).toFixed(2)}시간`,
  };

  const dataToChart = (type, data) => {
    if (data == undefined) return undefined;
    switch (type) {
      case 'kcal':
        return data.map(routine => {
          return { date: routine.tEnd, kcal: routine.routineResult.kcal };
        });

      case 'growth':
        return data.map(routine => {
          return {
            date: routine.tEnd,
            muscle: routine.routineResult.muscle,
            setTotal: routine.routineResult.reSet * routine.routineResult.setNum,
            volumeTotal: routine.routineResult.volum,
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
        return activitySet;
    }
  };
  const dataToCompare = (type, thisData, lastData) => {
    let compareLast;
    let compareThis;
    let arrayData = [];
    switch (type) {
      case 'kcal':
        compareLast = lastData.reduce((acc, val) => {
          return acc + val.routineResult.kcal;
        }, 0);
        compareThis = thisData.reduce((acc, val) => {
          return acc + val.routineResult.kcal;
        }, 0);
        return compareThis - compareLast;
      case 'growth':
        //근육사용량
        compareLast = lastData.reduce((acc, val) => {
          return acc + val.routineResult.muscle;
        }, 0);
        compareThis = thisData.reduce((acc, val) => {
          return acc + val.routineResult.muscle;
        }, 0);
        arrayData.push(compareThis - compareLast);
        //총세트수
        compareLast = lastData.reduce((acc, val) => {
          return acc + val.routineResult.reSet;
        }, 0);
        compareThis = thisData.reduce((acc, val) => {
          return acc + val.routineResult.reSet;
        }, 0);
        arrayData.push(compareThis - compareLast);
        //볼륨총합
        compareLast = lastData.reduce((acc, val) => {
          return acc + val.routineResult.volum;
        }, 0);
        compareThis = thisData.reduce((acc, val) => {
          return acc + val.routineResult.volum;
        }, 0);
        arrayData.push(compareThis - compareLast);
        //총운동시간
        compareLast = lastData.reduce((acc, val) => {
          return acc + val.routineResult.rouTime;
        }, 0);
        compareThis = thisData.reduce((acc, val) => {
          return acc + val.routineResult.rouTime;
        }, 0);
        arrayData.push(compareThis - compareLast);
        return arrayData;
      case 'activity':
        compareLast = [
          ...new Set(lastData.flatMap(e => e.routineEndDetails.map(detail => detail.srName))),
        ];
        compareThis = [
          ...new Set(thisData.flatMap(e => e.routineEndDetails.map(detail => detail.srName))),
        ];
        console.log(compareLast, compareThis);
        return compareThis.length - compareLast.length;
    }
  };
  const toLocalDateTime = date => {
    return date.toISOString().slice(0, 19);
  };
  const fetchWeeklyData = async last => {
    const today = new Date();
    if (last === 'last') today.setDate(today.getDate() - 7);
    const week = new Date();
    week.setDate(today.getDate() - 7);
    const data = await axios
      .post(
        'https://mogapi.kro.kr/api/v1/routine/result',
        {
          startDate: toLocalDateTime(week),
          endDate: toLocalDateTime(today),
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      )
      .then(res => {
        return res.data;
      })
      .catch(err => {
        return undefined;
      });

    return data;
  };
  const fetchMonthlyData = async last => {
    const today = new Date();
    if (last === 'last') today.setDate(today.getDate() - 30);
    const month = new Date();
    month.setDate(today.getDate() - 30);
    const data = await axios
      .post(
        'https://mogapi.kro.kr/api/v1/routine/result',
        {
          startDate: toLocalDateTime(month),
          endDate: toLocalDateTime(today),
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      )
      .then(res => {
        return res.data;
      })
      .catch(err => {
        return undefined;
      });

    return data;
  };
  useEffect(() => {
    const setInitData = async () => {
      const compareData =
        toggle === 'week' ? await fetchWeeklyData('last') : await fetchMonthlyData('last');
      const initData = toggle === 'week' ? await fetchWeeklyData() : await fetchMonthlyData();
      const kcalData = dataToChart('kcal', initData);
      const growthData = dataToChart('growth', initData);
      const activityData = dataToChart('activity', initData);
      setOriginData(initData);
      setBarData(kcalData);
      setLineData(growthData);
      setDoughnutData(activityData);

      setKcalCalc(dataToCompare('kcal', initData, compareData));
      setRedCalc(dataToCompare('growth', initData, compareData));
      setActivityCalc(dataToCompare('activity', initData, compareData));
      setActivityTop(
        Object.entries(activityData)
          .sort((a, b) => a[1] - b[1])
          .slice(Object.entries(activityData).length - 1)[0][0],
      );
    };

    setInitData();
  }, [toggle]);

  useEffect(() => {}, [mobile]);

  return (
    <div className={styles.stats}>
      <div className={styles['stats-title']}>
        <h1 style={{ fontWeight: 'bold' }}>
          이번 <span className={styles['stats-span']}>{toggle === 'week' ? '주' : '달'}</span> 운동
          통계
        </h1>
        <div className={styles['stats-toggle']}>
          <div
            className={`${styles[`stats-toggle-item`]} ${toggle === 'week' ? styles['on'] : styles['off']}`}
            onClick={() => {
              setToggle('week');
            }}
          >
            <i className="fa-solid fa-calendar-week"></i>주별
          </div>

          <div
            className={`${styles[`stats-toggle-item`]} ${toggle === 'month' ? styles['on'] : styles['off']}`}
            onClick={() => {
              setToggle('month');
            }}
          >
            <i className="fa-solid fa-calendar-days"></i>월별
          </div>
        </div>
      </div>
      {!mobile ? (
        <Container className={styles['stats-container']}>
          <Container className={styles['chart-container']}>
            <div className={styles['shadow-overlay']}>
              <Container className={styles['stats-chart']}>
                <Container className={styles['chart-title']}>
                  <Container className={styles['title-container']}>
                    <h2 className={styles['stats-h2']}>
                      이번 {toggle === 'week' ? '주' : '달'}{' '}
                      <span className={styles['stats-span']}>칼로리</span> 소모량
                    </h2>
                    <h5 className={styles['stats-h5']}>
                      저번{toggle === 'week' ? '주' : '달'} 보다 {kcalCalc} kcal 더 소모했어요
                    </h5>
                  </Container>
                </Container>
                <BarChart barData={barData} />
              </Container>
              <Container className={styles['stats-chart']}>
                <Container className={styles['chart-title']}>
                  <Container className={styles['title-container']}>
                    <div className={styles['title-dropdown']}>
                      <div className={styles['title']}>
                        <h2 className={styles['stats-h2']}>
                          이번 {toggle === 'week' ? '주' : '달'}{' '}
                          <span className={styles['stats-span']}>{keyMap[selectMenu]}</span> 성장
                          추이
                        </h2>
                        <h5 className={styles['stats-h5']}>
                          저번{toggle === 'week' ? '주' : '달'}보다 {redCalcMap[selectMenu]} 더
                          성장했어요
                        </h5>
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
                          {lineData && lineData.length > 0
                            ? Object.keys(lineData[0])
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
                                ))
                            : Object.keys(keyMap).map((data, i) => (
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
                    <h2 className={styles['stats-h2']}>
                      이번 {toggle === 'week' ? '주' : '달'} 운동{' '}
                      <span className={styles['stats-span']}>트렌드</span>
                    </h2>
                    <h5
                      className={styles['stats-h5']}
                    >{`이번 ${toggle === 'week' ? '주는' : '달은'} ${activityTop}을 가장 많이 했어요`}</h5>
                  </Container>
                </Container>
                <DoughnutChart doughnutData={doughnutData} isPolar={true} />
                <Container className={styles['chart-title']}>
                  <Container className={styles['title-container']}>
                    <h2 className={styles['stats-h2']}>
                      이번 {toggle === 'week' ? '주' : '달'} 운동{' '}
                      <span className={styles['stats-span']}>퍼포먼스</span>
                    </h2>
                    <h5 className={styles['stats-h5']}>
                      저번{toggle === 'week' ? '주' : '달'}보다 {activityCalc}개 더 다양하게
                      운동했어요
                    </h5>
                  </Container>
                </Container>
                <DoughnutChart doughnutData={doughnutData} isPolar={false} />
              </Container>
              <Container className={styles['stats-chart']}>
                <Container className={styles['chart-title']}>
                  <Container className={styles['title-container']}>
                    <h2 className={styles['stats-h2']}>
                      이번 {toggle === 'week' ? '주' : '달'}{' '}
                      <span className={styles['stats-span']}>운동 퍼포먼스</span> 로그
                    </h2>
                    <h5 className={styles['stats-h5']}>
                      이번 {toggle === 'week' ? '주' : '달'} 운동의 더 상세한 데이터를 볼 수 있어요
                    </h5>
                  </Container>
                </Container>
                {originData ? (
                  originData.length === 0 ? (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: 'transparent',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <i
                        className={`fa-solid fa-file-circle-xmark fa-4x`}
                        style={{ color: '#808080ff' }}
                      ></i>
                      기간 내 운동 기록이 없어요
                    </div>
                  ) : (
                    <Container className={styles['stats-logs']}>
                      <Container>
                        {originData?.map((data, i) => {
                          return (
                            <Card style={{ width: '100%' }}>
                              <Card.Header>{`루틴 ${data.tStart.substring(0, 10)} ${data.tStart.substring(11, 16)} ~ ${data.tEnd.substring(11, 16)}`}</Card.Header>
                              <Card.Body>
                                <Card.Body>
                                  <div className={styles['red-details']}>
                                    {Object.entries(data.routineResult).map(entry => {
                                      if (entry[0] == 'rrId') return;
                                      return (
                                        <div className={styles['red-detail']}>
                                          <div className={styles['red-key']}>
                                            {redKeyMap[entry[0]]}
                                          </div>
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
                  )
                ) : originData === undefined ? (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'transparent',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <LoadFail />
                  </div>
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'transparent',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <RadialGradientSpinner />
                  </div>
                )}
              </Container>
              :
            </div>
          </Container>
        </Container>
      ) : (
        <>
          <Container className={styles['chart-title']}>
            <Container className={styles['title-container']}>
              <h2 className={styles['stats-h2']}>
                이번 {toggle === 'week' ? '주' : '달'}{' '}
                <span className={styles['stats-span']}>칼로리</span> 소모량
              </h2>
              <h5 className={styles['stats-h5']}>
                저번{toggle === 'week' ? '주' : '달'} 보다 {kcalCalc} kcal 더 소모했어요
              </h5>
            </Container>
          </Container>
          <BarChart barData={barData} isMobile={mobile} />

          <Container className={styles['chart-title']}>
            <Container className={styles['title-container']}>
              <h2 className={styles['stats-h2']}>
                이번 {toggle === 'week' ? '주' : '달'}{' '}
                <span className={styles['stats-span']}></span> 성장 추이
              </h2>
              <h5 className={styles['stats-h5']}>
                저번{toggle === 'week' ? '주' : '달'}보다 {redCalcMap[selectMenu]} 더 성장했어요
              </h5>
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
                {lineData && lineData.length > 0
                  ? Object.keys(lineData[0])
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
                      ))
                  : Object.keys(keyMap).map((data, i) => (
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
              <h2 className={styles['stats-h2']}>
                이번 {toggle === 'week' ? '주' : '달'} 운동 트렌드
              </h2>
              <h5
                className={styles['stats-h5']}
              >{`이번 ${toggle === 'week' ? '주는' : '달은'} ${activityTop}을 가장 많이 했어요`}</h5>{' '}
            </Container>
          </Container>
          <DoughnutChart doughnutData={doughnutData} isPolar={true} isMobile={mobile} />
          <Container className={styles['chart-title']}>
            <Container className={styles['title-container']}>
              <h2 className={styles['stats-h2']}>
                이번 {toggle === 'week' ? '주' : '달'} 운동 퍼포먼스
              </h2>
              <h5 className={styles['stats-h5']}>
                저번{toggle === 'week' ? '주' : '달'}보다 {activityCalc}개 더 다양하게 운동했어요
              </h5>
            </Container>
          </Container>
          <DoughnutChart doughnutData={doughnutData} isPolar={false} isMobile={mobile} />

          <Container className={styles['chart-title']}>
            <Container className={styles['title-container']}>
              <h2 className={styles['stats-h2']}>
                이번 {toggle === 'week' ? '주' : '달'}{' '}
                <span className={styles['stats-span']}>운동 퍼포먼스</span> 로그
              </h2>
              <h5 className={styles['stats-h5']}>
                이번 {toggle === 'week' ? '주' : '달'} 운동의 더 상세한 데이터를 볼 수 있어요
              </h5>
            </Container>
          </Container>
          <Card>
            <Container className={styles['stats-logs']}>
              {originData ? (
                originData.length === 0 ? (
                  <div
                    style={{
                      minHeight: '300px',
                      background: 'transparent',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                      gap: '1em',
                    }}
                  >
                    <i
                      className={`fa-solid fa-file-circle-xmark fa-4x`}
                      style={{ color: '#808080ff' }}
                    ></i>
                    기간 내 운동 기록이 없어요
                  </div>
                ) : (
                  <Container>
                    {originData?.map((data, i) => {
                      return (
                        <Card style={{ width: '100%' }}>
                          <Card.Header>{`루틴 ${data.tStart.substring(0, 10)} ${data.tStart.substring(11, 16)} ~ ${data.tEnd.substring(11, 16)}`}</Card.Header>
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
                )
              ) : originData === undefined ? (
                <div
                  style={{
                    width: '100%',
                    minHeight: '300px',
                    background: 'transparent',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <LoadFail />
                </div>
              ) : (
                <div
                  style={{
                    width: '100%',
                    minHeight: '300px',
                    background: 'transparent',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <RadialGradientSpinner />
                </div>
              )}
            </Container>
          </Card>
        </>
      )}
    </div>
  );
}
