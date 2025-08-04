import { useContext, useEffect, useState } from 'react';
import { Button, Card, ListGroup, ProgressBar } from 'react-bootstrap';

import styles from './Stage.module.css';
import Type from './StageContent/Type/Type';
import Exercises from './Exercises/Exercises';
import BodyPart from './StageContent/BodyPart/BodyPart';
import Level from './StageContent/Level/Level';
import Equipment from './StageContent/Equipment/Equipment';
import RadialGradientSpinner from '../Loader/RadialGradientSpinner';
import { useSuggest } from '../../context/SuggestContext';
import axios from 'axios';
import { AuthContext } from '../../pages/Login/AuthContext';
import ModalSuggest from '../Modal/ModalSuggest';
import { useModalAlert } from '../../context/ModalAlertContext';
import { URL } from '../../config/constants';

export default function Stage() {
  const { showModal } = useModalAlert();
  const { user } = useContext(AuthContext);
  const { suggestState } = useSuggest();
  const [stageLevel, setStageLevel] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const [stageCategories, setStageCategories] = useState([]);
  const [suggestExercise, setSuggestExercise] = useState([]);
  const [suggestOriginExercise, setSuggestOriginExercise] = useState([]);
  const [suggestRoutine, setSuggestRoutine] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const Stage = ['Level', 'Type', 'BodyPart', 'Equipment'];
  const StageComponents = [
    <Level categories={stageCategories} />,
    <Type categories={stageCategories} />,
    <BodyPart categories={stageCategories} />,
    <Equipment categories={stageCategories} />,
  ];
  const StageMap = {
    Type: '운동 타입',
    BodyPart: '운동 부위',
    Equipment: '운동 장비',
    Level: '운동 경력',
  };
  const QuestionMap = {
    Type: '어떤 타입의 운동을 선호하세요?',
    BodyPart: '원하시는 운동 부위가 있나요?',
    Equipment: '운동 장비를 사용하고 싶으신가요?',
    Level: '운동을 해보신 경험이 있나요?',
  };

  function normalizeString(str) {
    return str
      .toLowerCase() // 소문자 변환
      .replace(/[-\/,.]/g, ' ') // 특수문자 → 공백
      .replace(/\s+/g, ' ') // 여러 공백 → 한 칸
      .trim(); // 앞뒤 공백 제거
  }

  const getExerciseCategories = categoryList => {
    setStageCategories(categoryList);
  };

  const getSuggestion = async () => {
    await axios
      .post('http://localhost:8000/suggest/exercises', {
        usersId: user.usersId,
        preferences: suggestState.suggest,
      })
      .then(res => {
        const suggestData = res.data;
        fetch('https://raw.githubusercontent.com/kimbongkum/ict4e/master/exercises.json')
          .then(res => res.json())
          .then(exercise => {
            // 1. 먼저 suggestData를 Map으로 만들어서 Title → Rating 연결
            const ratingMap = new Map(
              suggestData.recommendations.map(item => [normalizeString(item.Title), item.Rating]),
            );

            // 2. exercise에서 이름 일치하는 항목 필터
            const matched = exercise.exercises.filter(ex => {
              const normalizedName = normalizeString(ex.name);
              return ratingMap.has(normalizedName);
            });

            // 3. Rating 기준으로 정렬
            const sortedByRating = matched.sort((a, b) => {
              return (
                ratingMap.get(normalizeString(b.name)) - ratingMap.get(normalizeString(a.name))
              );
            });
            // 4. Rating, 운동이름 데이터  설정
            const exNameRating = sortedByRating.map(ex => {
              return { name: ex.name, ratings: ratingMap.get(normalizeString(ex.name)) };
            });
            // 최종 결과
            setTimeout(() => {
              setSuggestExercise(exNameRating);
              setSuggestOriginExercise(sortedByRating);
            }, 5000); // 최소 5초
          });
      })
      .catch(() => {
        window.alert('추천 루틴 생성에 실패했습니다');
      });
  };

  //랜덤 루틴 운동 아이템 설정
  const getRandomItems = (sourceArray, count) => {
    const result = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * sourceArray.length);
      result.push(sourceArray[randomIndex]);
    }
    return result;
  };

  //추천 루틴 추가
  const addRoutine = async (routineName, routineContent) => {
    await axios
      .get(URL.ROUNTINE)
      .then(res => res.data)
      .then(dataRoutine => {
        //백엔드 서버 루틴 추가
        axios
          .post(
            `http://localhost:8080/api/v1/routine/create`,
            { routineName: routineName, saveRoutineDto: [] },
            {
              headers: {
                Authorization: `Bearer ${user.accessToken}`,
              },
            },
          )
          .then(res => {
            const makeRoutineNode = routineContent.map((item, i) => {
              return {
                names: item.name,
                category: item.category,
                equipment: item.equipment,
                force: item.force,
                instructions: item.instructions,
                level: item.level,
                mechanic: item.mechanic,
                primaryMuscles: item.primaryMuscles,
                secondaryMuscles: item.secondaryMuscles,
                imgfile: `https://raw.githubusercontent.com/kimbongkum/ict4e/master/exercises/${item.name.replaceAll(' ', '_').replaceAll('/', '_')}/images/0.jpg`,
                set_id: i + 1,
              };
            });

            //json 서버 루틴 추가
            axios
              .post(URL.ROUNTINE, {
                id: String(
                  dataRoutine.length <= 0
                    ? 1
                    : parseInt(dataRoutine[dataRoutine.length - 1].id) + 1,
                ),
                name: routineName,
                userId: String(user.usersId),
                state: [...makeRoutineNode],
              })
              .then(res => {
                const makeDetailNode = [];
                const addSetId = routineContent.map((item, index) => ({
                  ...item,
                  set_id: String(index + 1),
                }));
                for (let i = 0; i <= addSetId.length - 1; i++) {
                  makeDetailNode.push({
                    id: addSetId[i].set_id,
                    names: addSetId[i].name,
                    img: `https://raw.githubusercontent.com/kimbongkum/ict4e/master/exercises/${addSetId[i].name.replaceAll(' ', '_').replaceAll('/', '_')}/images/0.jpg`,
                    lest: '30',
                    set: [
                      {
                        id: '1',
                        weight: '10',
                        many: '1',
                      },
                    ],
                  });
                }
                axios
                  .post(URL.ROUTINEDETAIL, {
                    id: String(
                      dataRoutine.length <= 0
                        ? 1
                        : parseInt(dataRoutine[dataRoutine.length - 1].id) + 1,
                    ),
                    state: [...makeDetailNode],
                  })
                  .then(res => {
                    showModal('루틴이 정상적으로 저장되었습니다');
                  })
                  .catch(err => {
                    console.log(err);
                    showModal('루틴 저장 중 오류가 발생했습니다');
                  });
              })
              .catch(err => {
                console.log(err);
                showModal('루틴 저장 중 오류가 발생했습니다');
              });
          })
          .catch(err => {
            console.log(err);
            showModal('루틴 저장 중 오류가 발생했습니다');
          });
      })
      .catch(err => {
        showModal('루틴 목록을 불러오는중 오류가 발생했습니다');
      });
  };

  useEffect(() => {}, [suggestState]);

  useEffect(() => {
    if (suggestOriginExercise.length > 0) {
      const randomRoutines = [];
      for (let i = 0; i < 3; i++) {
        const randomRoutine = getRandomItems(suggestOriginExercise, 5);
        randomRoutines.push(randomRoutine);
      }
      setSuggestRoutine(randomRoutines);
    }
  }, [suggestOriginExercise]);
  return (
    <div className={styles['stage']}>
      {suggestRoutine.length > 0 && (
        <ModalSuggest
          show={modalShow}
          onHide={() => setModalShow(false)}
          routineName={`AI 추천 루틴 ${selectedIndex + 1}`}
          routineContent={suggestRoutine[selectedIndex]}
          addRoutine={addRoutine}
        />
      )}
      <div className={styles['stage-title']}>{StageMap[Stage[stageLevel]]}</div>
      {suggestRoutine.length > 0 && (
        <>
          <div className={styles['stage-title']}>루틴 추천 결과</div>
          <div className={styles['stage-content-question']}>{`${user.email}님의 추천 운동`}</div>
          <div className={styles['suggest-content']}>
            <div className={styles['suggest-exercise-container']}>
              <ListGroup as="ul">
                <ListGroup.Item action style={{ backgroundColor: '#fdc800', fontWeight: 'bold' }}>
                  <div className={styles['suggest-exercise-list']}>
                    <div>운동 이름</div>
                    <div>추천도</div>
                  </div>
                </ListGroup.Item>
                {suggestExercise.map((item, i) => {
                  return (
                    <ListGroup.Item key={i} action style={{ backgroundColor: 'white' }}>
                      <div className={styles['suggest-exercise-list']}>
                        <div>{item.name}</div>
                        <div style={{ textAlign: 'center' }}>{item.ratings}</div>
                      </div>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </div>
            <div className={styles['suggest-routine']}>
              <div
                className={styles['stage-content-question']}
              >{`MOG가 추천 운동으로 루틴을 만들어봤어요!`}</div>
              <div className={styles['suggest-routine-container']}>
                {suggestRoutine.map((routine, i) => {
                  return (
                    <Card
                      className={styles['suggest-routine-card']}
                      style={{ width: '18rem', height: '300px', cursor: 'pointer' }}
                      key={i}
                      onClick={() => {
                        setSelectedIndex(i);
                        setModalShow(true);
                      }}
                    >
                      <Card.Img
                        variant="top"
                        style={{ overflowY: 'hidden' }}
                        src={`https://raw.githubusercontent.com/kimbongkum/ict4e/master/exercises/${routine[0].name.replaceAll(' ', '_').replaceAll('/', '_')}/images/0.jpg`}
                      />
                      <Card.Body
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                      >
                        <Card.Text style={{ color: 'black', fontWeight: 'bold' }}>
                          <span className={styles['span-text']}>AI 추천 </span>
                          {`루틴 ${i + 1}`}
                        </Card.Text>
                        <Button
                          variant="primary"
                          onClick={() => {
                            addRoutine(`AI 추천 루틴 ${i + 1}`, routine);
                          }}
                        >
                          바로 추가
                        </Button>
                      </Card.Body>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
      {stageLevel === Stage.length && suggestRoutine.length == 0 && (
        <>
          <div className={styles['complete-loader']}>
            <div className={`${styles['animate-loader']} ${styles['play']}`}>
              <RadialGradientSpinner isText={true} />
            </div>
            <ProgressBar
              striped
              variant="yellow"
              style={{
                width: '60%',
                height: '20px',
                borderRadius: '20px',
                '--bs-progress-bar-bg': '#fdc800',
              }}
              animated
              now={(stageLevel / Stage.length) * 100}
            />
          </div>
        </>
      )}

      {stageLevel !== Stage.length && (
        <>
          <ProgressBar
            striped
            variant="yellow"
            style={{
              width: '60%',
              height: '20px',
              borderRadius: '20px',
              '--bs-progress-bar-bg': '#fdc800',
            }}
            animated
            now={
              ((stageLevel + (suggestState.suggest[Stage[stageLevel]].length > 0 ? 1 : 0)) /
                Stage.length) *
              100
            }
          />
          <div className={styles['stage-content-question']}>{QuestionMap[Stage[stageLevel]]}</div>
          <div className={styles['stage-content']}>
            {StageComponents[stageLevel]}
            <Exercises
              getExerciseCategories={getExerciseCategories}
              categories={Stage[stageLevel]}
            />
            <div className={styles['stage-button-container']}>
              <div
                className={`${styles['stage-button-prev']} ${stageLevel === 0 && styles['disabled']}`}
                onClick={() => {
                  stageLevel === 0 ? null : setStageLevel(prev => prev - 1);
                }}
              >
                이전
              </div>
              <div
                className={`${styles['stage-button-next']} ${suggestState.suggest[Stage[stageLevel]].length === 0 && styles['disabled']}`}
                onClick={() => {
                  suggestState.suggest[Stage[stageLevel]].length === 0
                    ? null
                    : Stage[stageLevel] === 'Equipment'
                      ? (setStageLevel(prev => prev + 1),
                        window.scrollTo({ top: 0, behavior: 'smooth' }),
                        getSuggestion())
                      : setStageLevel(prev => prev + 1);
                }}
              >
                {Stage[stageLevel] === 'Equipment' ? '완료' : '다음'}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
