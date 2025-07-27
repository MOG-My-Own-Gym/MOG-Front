import { useContext, useEffect, useRef, useState } from 'react';
import RadialGradientSpinner from '../../../components/Loader/RadialGradientSpinner';
import axios from 'axios';
import styles from './SelectExercises.module.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../Login/AuthContext';
import { RoutineContext } from '../RoutineContext';
import ToastContext from '../../../context/ToastContext';

export default function SelectExercises() {
  const [originExerciseData, setOriginExerciseData] = useState([]);
  const [exerciseData, setExerciseData] = useState([]);
  const [search, setSearch] = useState('');
  const [userExercise, setUserExercise] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [imageLoading, setImageLoading] = useState(true);

  const { user } = useContext(AuthContext);
  const { routine, dispatch: dispatchRoutine } = useContext(RoutineContext);
  const { toast, dispatch: dispatchToast } = useContext(ToastContext);

  const [param] = useSearchParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const routineId = param.get('routineId');

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/kimbongkum/ict4e/master/exercises.json')
      .then(res => res.json())
      .then(exercise => {
        exercise.exercises = exercise.exercises.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        setOriginExerciseData(exercise.exercises);
        setExerciseData(exercise.exercises);
      });
  }, []);

  useEffect(() => {
    setExerciseData(originExerciseData.filter(ex => ex.name.includes(search)));
    setVisibleCount(5);
  }, [search]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setVisibleCount(prev => {
          const next = prev + 5;
          return next > exerciseData.length ? exerciseData.length : next;
        });
      }
    };

    const el = containerRef.current;
    if (el) el.addEventListener('scroll', handleScroll);
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
    };
  }, [exerciseData]);

  //수정 케이스
  useEffect(() => {
    if (routineId && originExerciseData.length > 0) {
      const fetchRoutineExercise = async () => {
        const data = await axios
          .get(`http://localhost:8080/api/v1/routine/${routineId}`, {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          })
          .then(res => {
            res.data.saveRoutineDto.forEach(sr => {
              setUserExercise(prev => [...prev, originExerciseData.find(ex => ex.id == sr.exId)]);
            });
            return res.data;
          });
        dispatchRoutine({ type: 'SAVE', routine: data, originRoutine: data });
      };
      fetchRoutineExercise();
    }
  }, [originExerciseData]);

  useEffect(() => {
    console.log(userExercise);
  }, [userExercise]);

  const handleSearchBar = e => {
    setSearch(e.target.value);
  };

  const createRoutine = async () => {
    try {
      routineId
        ? await axios
            .put(
              `http://localhost:8080/api/v1/routine/${routineId}/update`,
              {
                setId: routineId,
                routineName: routine.routineName,
                usersId: user.usersId,
                saveRoutineDto: userExercise.map(ex => {
                  return {
                    exId: ex.id,
                    srName: ex.name,
                    reps: 1,
                    set: [
                      {
                        weight: 0,
                        many: 0,
                      },
                    ],
                  };
                }),
              },
              {
                headers: {
                  Authorization: `Bearer ${user.accessToken}`,
                },
              },
            )
            .then(res => {
              dispatchRoutine({ type: 'SAVE', routine: res.data, originRoutine: res.data });
              //dispatchToast({ type: 'SHOW_TOAST', payload: '정상적으로 저장되었습니다' });
              navigate(
                `/routine/detail?routineId=${routineId}&detailId=${res.data.saveRoutineDto[0].srId}`,
              );
              return res.data;
            })
            .catch(err => {
              console.log(err);
              dispatchToast({
                type: 'SHOW_TOAST',
                payload: '저장 중 에러가 발생했습니다. 다시 시도해주세요',
              });
            })
        : await axios
            .post(
              'http://localhost:8080/api/v1/routine/create',
              {
                routineName: `루틴`,
                saveRoutineDto: userExercise.map(ex => {
                  return {
                    exId: ex.id,
                    srName: ex.name,
                    reps: 1,
                    set: [
                      {
                        weight: 0,
                        many: 0,
                      },
                    ],
                  };
                }),
              },
              {
                headers: {
                  Authorization: `Bearer ${user.accessToken}`,
                },
              },
            )
            .then(res => {
              dispatchRoutine({ type: 'SAVE', routine: res.data, originRoutine: res.data });
              navigate(
                `/routine/detail?routineId=${res.data.setId}&detailId=${res.data.saveRoutineDto[0].srId}`,
              );
            })
            .catch(err => {
              dispatchToast({ type: 'SHOW_TOAST', payload: err.message });
            });
    } catch {
      dispatchToast({ type: 'SHOW_TOAST', payload: '유효하지 않은 사용자입니다' });
    }
  };

  return (
    <div className={styles['exercise']}>
      <h2>운동 선택</h2>
      <input
        className={styles['searchbar']}
        type="text"
        placeholder="원하는 운동을 검색하세요"
        onChange={handleSearchBar}
      />
      <div
        className={styles['exercise-list']}
        ref={containerRef}
        style={{ height: '500px', overflowY: 'auto' }}
      >
        {exerciseData.slice(0, visibleCount).map(exercise => {
          return (
            <div
              className={styles['exercise-container']}
              onClick={() => setUserExercise(prev => [...prev, exercise])}
            >
              <div className={styles['exercise-item']}>
                {imageLoading && (
                  <div className={styles['image-loader']}>
                    <RadialGradientSpinner />
                  </div>
                )}
                <img
                  className={styles['exercise-img']}
                  onLoad={() => {
                    setImageLoading(false);
                  }}
                  style={{
                    display: imageLoading ? 'none' : 'block',
                    opacity: imageLoading ? 0 : 1,
                    transition: 'opacity 0.3s ease-in-out',
                  }}
                  src={`https://raw.githubusercontent.com/kimbongkum/ict4e/master/exercises/${exercise.name.replaceAll(' ', '_').replaceAll('/', '_')}/images/0.jpg`}
                />

                <div>{exercise.name}</div>
                <div>
                  {userExercise?.filter(val => val?.name === exercise.name)?.length !== 0
                    ? userExercise?.filter(val => val.name === exercise.name).length
                    : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {userExercise.length > 0 && (
        <div className={styles['exercise-button-container']}>
          <button
            className={styles['exercise-button']}
            onClick={e => {
              console.log(userExercise);
              e.stopPropagation();
              createRoutine();
            }}
          >
            {routineId ? '운동 수정' : '운동 추가'}
          </button>
          <button
            className={styles['exercise-button']}
            onClick={e => {
              console.log(userExercise);
              e.stopPropagation();
              setUserExercise(prev => prev.slice(0, -1));
            }}
          >
            되돌리기
          </button>
        </div>
      )}
    </div>
  );
}
